// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
export const removeUnwantedCharacters = (value: string) => {
    let result = value;

    result = result.replace(/(?<!\S):[^:\s]+:(?!\S)/g, (match) => {
        return match.replace(/\\_/g, '_');
    });

    return result;
};
