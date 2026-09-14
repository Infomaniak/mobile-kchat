// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.

import {withObservables} from '@nozbe/watermelondb/react';
import {combineLatestWith, type Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {observeConfigBooleanValue} from '@queries/servers/system';

import CategoryHeader from './header';

import type CategoryModel from '@typings/database/models/servers/category';

type EnhanceProps = {
    category: CategoryModel;
    currentChannelId$: Observable<string>;
}

const enhanced = withObservables(['category'], ({category, currentChannelId$}: EnhanceProps) => {
    const canViewArchived = observeConfigBooleanValue(category.database, 'ExperimentalViewArchivedChannels');

    return {
        category,
        hasChannels: canViewArchived.pipe(
            combineLatestWith(currentChannelId$),
            switchMap(([canView, channelId]) => category.observeHasChannels(canView, channelId)),
        ),
    };
});

export default enhanced(CategoryHeader);
