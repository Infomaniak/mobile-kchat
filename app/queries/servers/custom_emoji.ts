// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Database, Q} from '@nozbe/watermelondb';
import {distinctUntilChanged} from 'rxjs/operators';

import {MM_TABLES} from '@constants/database';

import type CustomEmojiModel from '@typings/database/models/servers/custom_emoji';

export const queryAllCustomEmojis = (database: Database) => {
    return database.get<CustomEmojiModel>(MM_TABLES.SERVER.CUSTOM_EMOJI).query();
};

export const observeAllCustomEmojis = (database: Database) => {
    return queryAllCustomEmojis(database).observeWithColumns(['name']).pipe(
        distinctUntilChanged(),
    );
};

export const queryCustomEmojisByName = (database: Database, names: string[]) => {
    return database.get<CustomEmojiModel>(MM_TABLES.SERVER.CUSTOM_EMOJI).query(Q.where('name', Q.oneOf(names)));
};
