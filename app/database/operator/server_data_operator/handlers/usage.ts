// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {MM_TABLES} from '@constants/database';
import {getUniqueRawsBy} from '@database/operator/utils/general';
import {logWarning} from '@utils/log';

import {transformUsageRecord} from '../transformers/usage';

import type ServerDataOperatorBase from '.';
import type CloudUsageModel from '@app/database/models/server/usage';
import type {CloudUsage} from '@typings/components/cloud';
import type {HandleUsageArgs} from '@typings/database/database';

const {
    USAGE,
} = MM_TABLES.SERVER;

export interface UsageHandlerMix {
    handleUsage: ({usage, prepareRecordsOnly}: any) => Promise<CloudUsageModel[]>;
}

const UsageHandler = <TBase extends Constructor<ServerDataOperatorBase>>(superclass: TBase) => class extends superclass {
    handleUsage = async ({usage, prepareRecordsOnly = true}: HandleUsageArgs): Promise<CloudUsageModel[]> => {
        console.log('🚀 ~ extends ~ handleUsage= ~ usage:', usage);
        if (!usage?.length) {
            logWarning(
                'An empty or undefined "usage" array has been passed to the handleUsage method',
            );
            return [];
        }

        return this.handleRecords<CloudUsageModel, CloudUsage>({
            fieldName: 'id',
            transformer: transformUsageRecord,
            prepareRecordsOnly,
            createOrUpdateRawValues: getUniqueRawsBy({raws: usage, key: 'id'}),
            tableName: USAGE,
        }, 'handleUsage');
    };
};

export default UsageHandler;
