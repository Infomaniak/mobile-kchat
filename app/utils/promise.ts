// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export const allSettled = Promise.allSettled || (<T>(promises: Array<Promise<T>>) => Promise.all(
    promises.map((p) => p.
        then((value) => ({status: 'fulfilled', value})).
        catch((reason) => ({status: 'rejected', reason})),
    ),
));
