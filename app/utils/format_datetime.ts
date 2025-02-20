// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {type ReactNode} from 'react';
import {type FormatRelativeTimeOptions, type FormatDateOptions} from 'react-intl';

import {isSameYear} from '@utils/datetime';
import {toCapitalized} from '@utils/strings';

type RelativeOptions = FormatRelativeTimeOptions & {
    unit: Intl.RelativeTimeFormatUnit;
    relNearest?: number;
    truncateEndpoints?: boolean;
    updateIntervalInSeconds?: number;
    capitalize?: boolean;
}

type SimpleRelativeOptions = {
    message: ReactNode;
    updateIntervalInSeconds?: number;
}

type DateTimeOptions = FormatDateOptions & {
    hourCycle?: string;
}

type ResolvedFormats = {
    relative: RelativeOptions | SimpleRelativeOptions | false;
    date: DateTimeOptions | false;
    time: DateTimeOptions | false;
}

interface FormatDateTimeProps {
    timeZone?: string;
    locale?: string;
    capitalize?: boolean;

    // IK: Mostly for tests
    comparisonDate?: Date;
}

export function getDateParts(value: Date, timeZone?: string, comparisonDate = new Date()): ResolvedFormats['date'] {
    if (isSameYear(value, comparisonDate)) {
        return {weekday: 'long', day: '2-digit', month: 'long'};
    }

    return {year: 'numeric', month: 'long', day: '2-digit'};
}

const defaultDateTimeProps: FormatDateTimeProps = {
    timeZone: undefined,
    locale: 'en',
};

export function formatDateTime(value: string | number | Date, options = defaultDateTimeProps): string {
    const {capitalize, locale, comparisonDate} = options;
    const timeZone = options.timeZone || undefined;
    const date = new Date(value);
    const dateTime = new Intl.DateTimeFormat(locale, {timeZone, ...getDateParts(date, timeZone, comparisonDate)}).format(date);

    // French is not capitalized
    return capitalize ? toCapitalized(dateTime) : dateTime;
}

export default formatDateTime;
