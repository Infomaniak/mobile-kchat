// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q, type Database} from '@nozbe/watermelondb';
import {switchMap} from '@nozbe/watermelondb/utils/rx';

import {MM_TABLES} from '@app/constants/database';

import type LimitsModel from '@app/database/models/server/limits';

const {SERVER: {LIMIT}} = MM_TABLES;

export const observeLimits = (database: Database) => {
    return database.get<LimitsModel>(LIMIT).
        query(Q.take(1)).
        observe().
        pipe(
            switchMap((result) => (result[0].observe())),
        );
};
