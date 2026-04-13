// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Duration} from 'luxon';
import {defineMessages, type IntlShape} from 'react-intl';

const durationMessages = defineMessages({
    year: {
        id: 'duration.year',
        defaultMessage: '{count, plural, one {year} other {years}}',
    },
    month: {
        id: 'duration.month',
        defaultMessage: '{count, plural, one {month} other {months}}',
    },
    day: {
        id: 'duration.day',
        defaultMessage: '{count, plural, one {day} other {days}}',
    },
});

type Unit = 'years' | 'months' | 'days';

const units: Array<[Unit, keyof typeof durationMessages]> = [
    ['years', 'year'],
    ['months', 'month'],
    ['days', 'day'],
];

export function formatYMDDurationHuman(
    iso: string,
    intl: IntlShape,
): string {
    const dur = Duration.fromISO(iso);
    const nf = new Intl.NumberFormat(intl.locale);

    return units.
        map(([key, msgKey]) => {
            const val = dur[key];
            if (!val) {
                return null;
            }

            const label = intl.formatMessage(durationMessages[msgKey], {count: val});

            return `${nf.format(val)} ${label}`;
        }).
        filter(Boolean).
        join(' ');
}
