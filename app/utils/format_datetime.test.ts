// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import formatDateTime from './format_datetime';

const dateString = '2024-03-28 02:23:27';

const d = () => new Date(dateString);

const options = {
    timeZone: 'Europe/Zurich',
    locale: 'en',
    capitalize: true,
    comparisonDate: d(),
};

describe('Format Datetime', () => {
    test('Same week | Not capitalized', () => {
        const date = d();
        date.setDate(date.getDate() - 3);

        expect(formatDateTime(date, options)).toEqual('Monday, March 25');
        expect(formatDateTime(date, {...options, locale: 'fr'})).toEqual('Lundi 25 mars');
    });
    test('Same year | Not capitalized', () => {
        const date = d();
        date.setMonth(date.getMonth() - 1);

        expect(formatDateTime(date, options)).toEqual('Wednesday, February 28');
        expect(formatDateTime(date, {...options, capitalize: false, locale: 'de'})).toEqual('mittwoch, 28. februar');
    });
    test('Beyond past | Date as number', () => {
        const date = d();
        date.setFullYear(date.getFullYear() - 1);

        expect(formatDateTime(date, options)).toEqual('March 28, 2023');
        expect(formatDateTime(date.valueOf(), {...options, locale: 'de'})).toEqual('28. März 2023');
        expect(formatDateTime(date.valueOf(), {...options, locale: 'fr'})).toEqual('28 mars 2023');
    });
});
