// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
export async function withMinDuration<T>(fn: () => Promise<T>, minDuration: number): Promise<T> {
    const start = Date.now();

    const result = await fn();

    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minDuration - elapsed);

    if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
    }

    return result;
}
