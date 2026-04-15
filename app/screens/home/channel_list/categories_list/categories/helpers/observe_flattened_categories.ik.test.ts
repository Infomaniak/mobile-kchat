// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// IK regression test: sidebar must NOT re-emit when last_post_at changes (only on is_unread changes).
// See: fix/sidebar-last-post-at-observer
// The upstream merge introduced observeWithColumns(['last_post_at', 'is_unread']), causing a full
// sidebar recalculation on every sent/received message. This test ensures we stay on ['is_unread'].

import {firstValueFrom, skip} from 'rxjs';

import DatabaseManager from '@database/manager';
import {observeFlattenedCategories} from '@screens/home/channel_list/categories_list/categories/helpers/observe_flattened_categories';
import TestHelper from '@test/test_helper';
import {advanceTimers, enableFakeTimers, disableFakeTimers} from '@test/timer_helpers';

import type Database from '@nozbe/watermelondb/Database';
import type CategoryModel from '@typings/database/models/servers/category';

const SERVER_URL = 'https://test.observe-categories.com';

describe('observe_flattened_categories — IK perf regression', () => {
    let database: Database;

    beforeEach(async () => {
        await DatabaseManager.init([SERVER_URL]);
        const result = await TestHelper.setupServerDatabase(SERVER_URL);
        database = result.database;
    });

    afterEach(async () => {
        await DatabaseManager.destroyServerDatabase(SERVER_URL);
    });

    // This is the core regression test: last_post_at must NOT be in the observed columns.
    // If last_post_at is included, every sent message triggers a full sidebar recalculation.
    it('should NOT observe last_post_at on myChannels (perf regression guard)', async () => {
        const categories = await database.get<CategoryModel>('Category').query().fetch();
        expect(categories.length).toBeGreaterThan(0);

        const category = categories[0];
        const observedColumns: string[][] = [];

        // Spy on observeWithColumns to capture which columns are being observed
        const original = category.myChannels.observeWithColumns.bind(category.myChannels);
        jest.spyOn(category.myChannels, 'observeWithColumns').mockImplementation((cols: string[]) => {
            observedColumns.push(cols);
            return original(cols);
        });

        const obs = observeFlattenedCategories(
            database,
            TestHelper.basicUser!.id,
            'en',
            false,
            false,
            TestHelper.basicTeam!.id,
        );

        // Subscribe to trigger the observable setup
        const sub = obs.subscribe();
        await new Promise(process.nextTick);
        sub.unsubscribe();

        // Verify that last_post_at is NOT in any of the observed column sets
        for (const cols of observedColumns) {
            expect(cols).not.toContain('last_post_at');
        }

        // Verify that is_unread IS observed (the correct trigger)
        const hasIsUnread = observedColumns.some((cols) => cols.includes('is_unread'));
        expect(hasIsUnread).toBe(true);
    });

    it('should NOT re-emit when last_post_at changes (sending a message)', async () => {
        enableFakeTimers();

        const obs = observeFlattenedCategories(
            database,
            TestHelper.basicUser!.id,
            'en',
            false,
            false,
            TestHelper.basicTeam!.id,
        );

        // Collect the initial emission
        await firstValueFrom(obs);

        let extraEmissionCount = 0;
        const sub = obs.pipe(skip(1)).subscribe(() => {
            extraEmissionCount++;
        });

        // Simulate sending a message: only last_post_at changes, is_unread stays false
        const myChannelRecord = await database.get('MyChannel').find(TestHelper.basicChannel!.id);
        await database.write(async () => {
            await myChannelRecord.update((mc: any) => {
                mc.lastPostAt = Date.now();
            });
        });

        await advanceTimers(500);

        sub.unsubscribe();
        disableFakeTimers();

        expect(extraEmissionCount).toBe(0);
    });
});
