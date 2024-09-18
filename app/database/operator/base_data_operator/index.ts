// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Database, Q} from '@nozbe/watermelondb';

import {OperationType} from '@constants/database';
import {
    getRangeOfValues,
    getValidRecordsForUpdate,
    retrieveRecords,
} from '@database/operator/utils/general';
import {logWarning} from '@utils/log';

import type Model from '@nozbe/watermelondb/Model';
import type {
    HandleRecordsArgs,
    OperationArgs,
    ProcessRecordResults,
    ProcessRecordsArgs,
    RecordPair,
} from '@typings/database/database';

export interface BaseDataOperatorType {
    database: Database;
    handleRecords: <T extends Model, R extends RawValue>(args: HandleRecordsArgs<T, R>, description: string) => Promise<Model[]>;
    processRecords: <T extends Model, R extends RawValue>(args: ProcessRecordsArgs<T, R>) => Promise<ProcessRecordResults<T>>;
    batchRecords: (models: Model[], description: string) => Promise<void>;
    prepareRecords: <T extends Model>(args: OperationArgs<T>) => Promise<Model[]>;
}

export default class BaseDataOperator {
    database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    /**
     * processRecords: This method weeds out duplicates entries.  It may happen that we do multiple inserts for
     * the same value.  Hence, prior to that we query the database and pick only those values that are  'new' from the 'Raw' array.
     * @param {ProcessRecordsArgs} inputsArg
     * @param {RawValue[]} inputsArg.createOrUpdateRawValues
     * @param {string} inputsArg.tableName
     * @param {string} inputsArg.fieldName
     * @param {(record: Model) => boolean} inputsArg.buildKeyRecordBy
     * @param {(rawValues: RawValue[]) => Q.Clause} inputsArg.buildClauseFromRawValues
     * @param {(existing: Model, newElement: RawValue) => boolean} inputsArg.matchRecord
     * @param {(existing: Model, newElement: RawValue) => boolean} inputsArg.shouldUpdate
     * @returns {Promise<{ProcessRecordResults}>}
     */
    processRecords = async <T extends Model, R extends RawValue>({createOrUpdateRawValues = [], deleteRawValues = [], tableName, fieldName, buildKeyRecordBy, buildClauseFromRawValues, matchRecord, shouldUpdate}: ProcessRecordsArgs<T, R>): Promise<ProcessRecordResults<T>> => {
        let getClauseFromRawValues: ProcessRecordsArgs<T, R>['buildClauseFromRawValues'];
        if (typeof buildClauseFromRawValues === 'function') {
            // Create the raw value to Q.Clause condition
            getClauseFromRawValues = buildClauseFromRawValues;
        } else if (typeof fieldName === 'string') {
            getClauseFromRawValues = (rawValues: R[]) => {
                // We will query a table where one of its fields can match a range of values.  Hence, here we are extracting all those potential values.
                const columnValues = getRangeOfValues({fieldName, raws: rawValues});

                if (!columnValues.length && rawValues.length) {
                    throw new Error(
                        `Invalid "fieldName" or "tableName" has been passed to the processRecords method for tableName ${tableName} fieldName ${fieldName}`,
                    );
                }

                if (!rawValues.length) {
                    return null;
                }

                return Q.where(fieldName, Q.oneOf(columnValues));
            };
        }
        if (typeof getClauseFromRawValues === 'undefined') {
            // Either "fieldName" or "buildClauseFromRawValues" must be specified
            throw new Error('Invalid call to processRecords either "fieldName" or "buildClauseFromRawValues" must be specified');
        }

        const getRecords = async (rawValues: R[]) => {
            const condition = getClauseFromRawValues!(rawValues);
            if (condition === null) {
                return [];
            }
            return retrieveRecords<T>({database: this.database, tableName, condition});
        };

        const createRaws: RecordPair[] = [];
        const updateRaws: RecordPair[] = [];

        // for delete flow
        const deleteRaws = await getRecords(deleteRawValues);

        // for create or update flow
        const createOrUpdateRaws = await getRecords(createOrUpdateRawValues);

        // Create the existing record finder function based on arguments
        let getExistingRecord: (RawValue: R) => T | undefined;
        if (typeof matchRecord === 'function') {
            // Find a matching record using the "Array.find" function
            getExistingRecord = (rawValue: R) =>
                createOrUpdateRaws.find((existing) => matchRecord(existing, rawValue));
        } else if (typeof fieldName === 'string') {
            // Match the existing record using the fieldName as key
            const getKey = (thing: T | R) => {
                if (typeof buildKeyRecordBy === 'function') {
                    return buildKeyRecordBy(thing);
                }

                return thing[fieldName as keyof R & keyof T] as string | number;
            };

            // Pre-construct a key to record dictionnary
            const recordsByKeys = createOrUpdateRaws.reduce((result, record) => {
                result[getKey(record)] = record;
                return result;
            }, {} as Record<ReturnType<typeof getKey>, T>);

            // Simple dict by key accessor function
            getExistingRecord = (rawValue: R) => recordsByKeys[getKey(rawValue)];
        } else {
            throw new Error('Invalid call to processRecords either "fieldName" or "matchRecord" must be specified');
        }

        if (createOrUpdateRawValues.length > 0) {
            for (const newElement of createOrUpdateRawValues) {
                const existingRecord = getExistingRecord(newElement);

                // We found a record in the database that matches this element; hence, we'll proceed for an UPDATE operation
                if (existingRecord) {
                    if (shouldUpdate && !shouldUpdate(existingRecord, newElement)) {
                        continue;
                    }

                    // Some raw value has an update_at field.  We'll proceed to update only if the update_at value is different from the record's value in database
                    const updateRecords = getValidRecordsForUpdate({
                        tableName,
                        existingRecord,
                        newValue: newElement,
                    });

                    updateRaws.push(updateRecords);
                    continue;
                }

                // This RawValue is not present in the database; hence, we need to create it
                createRaws.push({record: undefined, raw: newElement});
            }
        }

        return {
            createRaws,
            updateRaws,
            deleteRaws,
        };
    };

    /**
     * prepareRecords: Utility method that actually calls the operators for the handlers
     * @param {OperationArgs} prepareRecord
     * @param {string} prepareRecord.tableName
     * @param {RawValue[]} prepareRecord.createRaws
     * @param {RawValue[]} prepareRecord.updateRaws
     * @param {Model[]} prepareRecord.deleteRaws
     * @param {(TransformerArgs) => Promise<Model>;} transformer
     * @returns {Promise<Model[]>}
     */
    prepareRecords = async <T extends Model>({tableName, createRaws, deleteRaws, updateRaws, transformer}: OperationArgs<T>): Promise<T[]> => {
        if (!this.database) {
            logWarning('Database not defined in prepareRecords');
            return [];
        }

        let preparedRecords: Array<Promise<T>> = [];

        // create operation
        if (createRaws?.length) {
            const recordPromises = createRaws.map(
                (createRecord: RecordPair) => {
                    return transformer({
                        database: this.database,
                        tableName,
                        value: createRecord,
                        action: OperationType.CREATE,
                    });
                },
            );

            preparedRecords = preparedRecords.concat(recordPromises);
        }

        // update operation
        if (updateRaws?.length) {
            const recordPromises = updateRaws.map(
                (updateRecord: RecordPair) => {
                    return transformer({
                        database: this.database,
                        tableName,
                        value: updateRecord,
                        action: OperationType.UPDATE,
                    });
                },
            );

            preparedRecords = preparedRecords.concat(recordPromises);
        }

        const results = (await Promise.all(preparedRecords)) as T[];

        if (deleteRaws?.length) {
            deleteRaws.forEach((deleteRecord) => {
                results.push(deleteRecord.prepareDestroyPermanently());
            });
        }

        return results;
    };

    /**
     * batchRecords: Accepts an instance of Database (either Default or Server) and an array of
     * prepareCreate/prepareUpdate 'models' and executes the actions on the database.
     * @param {Array} models
     * @returns {Promise<void>}
     */
    async batchRecords(models: Model[], description: string): Promise<void> {
        try {
            if (models.length > 0) {
                await this.database.write(async (writer) => {
                    await writer.batch(...models);
                }, description);
            }
        } catch (e) {
            logWarning('batchRecords error ', description, e as Error);
        }
    }

    /**
     * handleRecords : Utility that processes some records' data against values already present in the database so as to avoid duplicity.
     * @param {HandleRecordsArgs} handleRecordsArgs
     * @param {string} description
     * @returns {Promise<Model[]>}
     */
    async handleRecords<T extends Model, R extends RawValue>({
        prepareRecordsOnly,
        transformer,
        ...processRecordArgs
    }: HandleRecordsArgs<T, R>, description: string): Promise<T[]> {
        const {tableName, createOrUpdateRawValues} = processRecordArgs;
        const deleteRawValues = processRecordArgs.deleteRawValues ?? [];

        if (!createOrUpdateRawValues.length && !deleteRawValues.length) {
            logWarning(
                `An empty "rawValues" array has been passed to the handleRecords method for tableName ${tableName}`,
            );
            return [];
        }

        const {createRaws, deleteRaws, updateRaws} = await this.processRecords(processRecordArgs);

        let models: T[] = [];
        models = await this.prepareRecords<T>({
            tableName,
            createRaws,
            updateRaws,
            deleteRaws,
            transformer,
        });

        if (!prepareRecordsOnly && models?.length) {
            await this.batchRecords(models, description);
        }

        return models;
    }
}
