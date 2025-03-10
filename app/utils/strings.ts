// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export function nonBreakingString(s: string) {
    return s.replace(/ /g, '\xa0');
}

export const toCamelCase = (str: string) =>
    str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase())).replace(/\s+/g, '');

export const toCapitalized = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};
