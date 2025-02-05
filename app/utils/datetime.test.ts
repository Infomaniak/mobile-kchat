// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {isSameDate, isSameMonth, isSameYear, isToday, isYesterday, getDiff} from './datetime';

describe('Datetime', () => {
    test('isSameDate (isSameMonth / isSameYear)', () => {
        expect(isSameDate(new Date('2024-03-28 02:23:27'), new Date('2025-03-28 02:23:27'))).toBe(false);
        expect(isSameDate(new Date('2024-03-28 02:23:27'), new Date('2024-02-28 02:23:27'))).toBe(false);
        expect(isSameDate(new Date('2024-03-28 02:23:27'), new Date('2024-03-18 02:23:27'))).toBe(false);
        expect(isSameDate(new Date('2024-03-28 02:23:27'), new Date('2024-03-28 00:00:00'))).toBe(true);
        expect(isSameDate(new Date('2024-03-28 02:23:27'))).toBe(false);
        expect(isSameDate(new Date())).toBe(true);
    });

    test('isSameMonth with default', () => {
        expect(isSameMonth(new Date('2024-03-28 02:23:27'))).toBe(false);
        expect(isSameMonth(new Date())).toBe(true);
    });

    test('isSameYear with default', () => {
        expect(isSameYear(new Date('2022-03-28 02:23:27'))).toBe(false);
        expect(isSameYear(new Date())).toBe(true);
    });

    test('isToday', () => {
        expect(isToday(new Date('2024-03-28 02:23:27'))).toBe(false);
        expect(isToday(new Date())).toBe(true);
    });

    test('isYesteday', () => {
        expect(isYesterday(new Date('2024-03-28 02:23:27'))).toBe(false);
        const today = new Date();
        today.setDate(today.getDate() - 1);
        expect(isYesterday(today)).toBe(true);
    });
});

describe('getDiff', () => {
    const tz = '';

    test('tomorrow at 12am', () => {
        const now = new Date();
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(0);
        date.setMinutes(0);

        expect(getDiff(date, now, tz, 'day')).toBe(+1);
    });

    test('now', () => {
        const now = new Date();
        const date = new Date();

        expect(getDiff(date, now, tz, 'day')).toBe(0);
    });

    test('today at 12am', () => {
        const now = new Date();
        const date = new Date();
        date.setHours(0);
        date.setMinutes(0);

        expect(getDiff(date, now, tz, 'day')).toBe(0);
    });

    test('today at 11:59pm', () => {
        const now = new Date();
        const date = new Date();
        date.setHours(23);
        date.setMinutes(59);

        expect(getDiff(date, now, tz, 'day')).toBe(0);
    });

    test('yesterday at 11:59pm', () => {
        const now = new Date();
        const date = new Date();
        date.setDate(date.getDate() - 1);
        date.setHours(23);
        date.setMinutes(59);

        expect(getDiff(date, now, tz, 'day')).toBe(-1);
    });

    test('yesterday at 12am', () => {
        const now = new Date();
        const date = new Date();
        date.setDate(date.getDate() - 1);
        date.setHours(0);
        date.setMinutes(0);

        expect(getDiff(date, now, tz, 'day')).toBe(-1);
    });

    test('two days ago at 11:59pm', () => {
        const now = new Date();
        const date = new Date();
        date.setDate(date.getDate() - 2);
        date.setHours(23);
        date.setMinutes(59);

        expect(getDiff(date, now, tz, 'day')).toBe(-2);
    });

    test('366 days ago at 11:59pm', () => {
        const now = new Date();
        const date = new Date();
        date.setDate(date.getDate() - 366);
        date.setHours(23);
        date.setMinutes(59);

        expect(getDiff(date, now, tz, 'day')).toBe(-366);
    });
});

