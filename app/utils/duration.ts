// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Duration} from 'luxon';

import type {IntlShape} from 'react-intl';

type Unit = 'years' | 'months' | 'days';

const units: Array<[Unit, string]> = [
    ['years', 'duration.year'],
    ['months', 'duration.month'],
    ['days', 'duration.day'],
];

export function formatYMDDurationHuman(
    iso: string,
    intl: IntlShape,
): string {
    const dur = Duration.fromISO(iso);
    console.log('🚀 ~ dur:', dur.days);
    const nf = new Intl.NumberFormat(intl.locale);
    console.log('🚀 ~ nf:', nf);

    return units.
        map(([key, id]) => {
            const val = dur[key];
            if (!val) {
                return null;
            }

            const label = intl.formatMessage(
                {id, defaultMessage: '{count, plural, one {#} other {#s}}'},
                {count: val},
            );
            console.log('label', `${nf.format(val)} ${label}`);

            return `${nf.format(val)} ${label}`;
        }).
        filter(Boolean).
        join(' ');
}
