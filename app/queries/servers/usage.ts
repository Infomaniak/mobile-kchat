// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Q, type Database} from '@nozbe/watermelondb';
import {switchMap} from '@nozbe/watermelondb/utils/rx';

import {MM_TABLES} from '@constants/database';

import type {CloudUsageModel} from '@database/models/server';

const {SERVER: {USAGE}} = MM_TABLES;

export const observeUsage = (database: Database) => {
    return database.get<CloudUsageModel>(USAGE).
        query(Q.take(1)).
        observe().
        pipe(
            switchMap((result) => (result[0]?.observe())),
        );
};
