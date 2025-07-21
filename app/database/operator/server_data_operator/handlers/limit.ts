// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {MM_TABLES} from '@constants/database';
import {getUniqueRawsBy} from '@database/operator/utils/general';
import {logWarning} from '@utils/log';

import {transformLimitRecord} from '../transformers/limit';

import type ServerDataOperatorBase from '.';
import type LimitsModel from '@app/database/models/server/limits';
import type {Limits} from '@typings/components/cloud';
import type {HandleLimitsArgs} from '@typings/database/database';

const {
    LIMIT,
} = MM_TABLES.SERVER;

export interface LimitHandlerMix {
    handleLimit: ({limits, prepareRecordsOnly}: any) => Promise<LimitsModel[]>;
}

const LimitHandler = <TBase extends Constructor<ServerDataOperatorBase>>(superclass: TBase) => class extends superclass {
    handleLimit = async ({limits, prepareRecordsOnly = true}: HandleLimitsArgs): Promise<LimitsModel[]> => {
        if (!limits?.length) {
            logWarning(
                'An empty or undefined "limits" array has been passed to the handleLimit method',
            );
            return [];
        }

        return this.handleRecords<LimitsModel, Limits>({
            fieldName: 'id',
            transformer: transformLimitRecord,
            prepareRecordsOnly,
            createOrUpdateRawValues: getUniqueRawsBy({raws: limits, key: 'id'}),
            tableName: LIMIT,
        }, 'handleLimit');
    };
};

export default LimitHandler;
