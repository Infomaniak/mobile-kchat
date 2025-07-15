// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useDatabase} from '@nozbe/watermelondb/react';
import {useEffect, useState} from 'react';

import {observeCurrentPackName} from '@app/queries/servers/team';

export function useNextPlan() {
    const database = useDatabase();
    const [packName, setPackName] = useState<string | undefined>();

    useEffect(() => {
        const sub = observeCurrentPackName(database).subscribe(setPackName);
        return () => sub.unsubscribe();
    }, [database]);

    return packName;
}
