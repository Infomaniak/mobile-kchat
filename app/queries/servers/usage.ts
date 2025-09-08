// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Q, type Database} from '@nozbe/watermelondb';
import {switchMap} from '@nozbe/watermelondb/utils/rx';
import {of as of$} from 'rxjs';

import {MM_TABLES} from '@constants/database';

import type {CloudUsageModel} from '@database/models/server';

const {SERVER: {USAGE}} = MM_TABLES;

export const observeUsage = (database: Database, teamId: string) => {
    return database.get<CloudUsageModel>(USAGE).
        query(Q.where('id', teamId)).
        observe().
        pipe(
            switchMap((result) => (result.length ? result[0]?.observe() : of$(undefined))),
        );
};
