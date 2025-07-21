// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {MM_TABLES} from '@constants/database';
import {getUniqueRawsBy} from '@database/operator/utils/general';
import {logWarning} from '@utils/log';

import {transformLimitRecord} from '../transformers/limit';

import type ServerDataOperatorBase from '.';
import type LimitsModel from '@app/database/models/server/limits';
import type CloudUsageModel from '@app/database/models/server/usage';
import type {CloudUsage, Limits} from '@typings/components/cloud';
import type {HandleLimitsArgs, HandleUsageArgs} from '@typings/database/database';

const {
    USAGE,
} = MM_TABLES.SERVER;

export interface UsageHandlerMix {
    handleUsage: ({usage, prepareRecordsOnly}: any) => Promise<LimitsModel[]>;
}

const UsageHandler = <TBase extends Constructor<ServerDataOperatorBase>>(superclass: TBase) => class extends superclass {
    handleUsage = async ({usage, prepareRecordsOnly = true}: HandleUsageArgs): Promise<CloudUsageModel[]> => {
        if (!usage?.length) {
            logWarning(
                'An empty or undefined "usage" array has been passed to the handleUsage method',
            );
            return [];
        }

        return this.handleRecords<CloudUsageModel, CloudUsage>({
            fieldName: 'id',
            transformer: transformLimitRecord,
            prepareRecordsOnly,
            createOrUpdateRawValues: getUniqueRawsBy({raws: usage, key: 'id'}),
            tableName: USAGE,
        }, 'handleLimit');
    };
};

export default UsageHandler;
