// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import moment from 'moment';

const shouldTruncate = new Map<Intl.RelativeTimeFormatUnit, boolean>([
    ['year', true],
    ['quarter', true],
    ['month', true],
    ['week', true],
    ['day', true],
    ['hour', false],
    ['minute', false],
    ['second', true],
]);

export function isSameDate(a: Date, b: Date = new Date()): boolean {
    return a.getDate() === b.getDate() && isSameMonth(a, b) && isSameYear(a, b);
}

export function isSameMonth(a: Date, b: Date = new Date()): boolean {
    return a.getMonth() === b.getMonth() && isSameYear(a, b);
}

export function isSameYear(a: Date, b: Date = new Date()): boolean {
    return a.getFullYear() === b.getFullYear();
}

export function isToday(date: Date) {
    const now = new Date();

    return isSameDate(date, now);
}

export function isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return isSameDate(date, yesterday);
}

export function getDiff(
    a: Date,
    b: Date,
    timeZone: string = new Intl.DateTimeFormat().resolvedOptions().timeZone,
    unit: Intl.RelativeTimeFormatUnit,
    truncateEndpoints = shouldTruncate.get(unit) || false,
): number {
    const [momentA, momentB] = [a, b].map((date) => moment.utc(date.getTime()));

    if (timeZone) {
        momentA.tz(timeZone);
        momentB.tz(timeZone);
    }

    return truncateEndpoints ? momentA.startOf(unit).diff(momentB.startOf(unit), unit) : momentA.diff(b, unit, true);
}

export function isWithin(
    a: Date,
    b: Date,
    timeZone: string = new Intl.DateTimeFormat().resolvedOptions().timeZone,
    unit: Intl.RelativeTimeFormatUnit,
    threshold = 1,
    truncateEndpoints = shouldTruncate.get(unit) || false,
): boolean {
    const diff = getDiff(a, b, timeZone, unit, truncateEndpoints);
    return threshold >= 0 ? diff <= threshold && diff >= 0 : diff >= threshold && diff <= 0;
}

export function toMilliseconds({days, hours, minutes, seconds}: {days?: number; hours?: number; minutes?: number; seconds?: number}) {
    const totalHours = ((days || 0) * 24) + (hours || 0);
    const totalMinutes = (totalHours * 60) + (minutes || 0);
    const totalSeconds = (totalMinutes * 60) + (seconds || 0);
    return totalSeconds * 1000;
}

function pad(num: number) {
    return ('0' + num).slice(-2);
}

export function mmssss(milisecs: number) {
    const secs = Math.floor(milisecs / 1000);
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;

    // const miliseconds = Math.floor((milisecs % 1000) / 10);
    // return pad(minutes) + ':' + pad(seconds) + ':' + pad(miliseconds);

    return pad(minutes) + ':' + pad(seconds);
}
