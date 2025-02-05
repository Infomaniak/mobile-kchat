// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {type ReactNode} from 'react';
import {type FormatRelativeTimeOptions, type FormatDateOptions} from 'react-intl';

import {isWithin, isSameYear} from '@utils/datetime';
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
    timeZone: string;
    locale?: string;
    capitalize?: boolean;
}

export function getDateParts(value: Date, timeZone: string): ResolvedFormats['date'] {
    if (isWithin(value, new Date(), timeZone, 'day', -6)) {
        return {day: '2-digit', weekday: 'long', month: 'long'};
    }
    if (isSameYear(value)) {
        return {day: '2-digit', month: 'long', weekday: 'long'};
    }

    return {year: 'numeric', month: 'long', day: '2-digit'};
}

const defaultDateTimeProps: FormatDateTimeProps = {
    timeZone: '',
    locale: 'en',
    capitalize: true,
};

export function formatDateTime(value: string | number | Date, options = defaultDateTimeProps): string {
    const {capitalize, timeZone, locale} = options;
    const date = new Date(value);
    const dateTime = new Intl.DateTimeFormat(locale, {timeZone, ...getDateParts(date, timeZone)}).format(date);

    return capitalize ? toCapitalized(dateTime) : dateTime;
}

export default formatDateTime;
