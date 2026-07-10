// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {BehaviorSubject} from 'rxjs';

import {logDebug} from '@utils/log';
import {captureMessage} from '@utils/sentry';

const loadingTeamChannels: {[serverUrl: string]: BehaviorSubject<number>} = {};

export const getLoadingTeamChannelsSubject = (serverUrl: string) => {
    if (!loadingTeamChannels[serverUrl]) {
        loadingTeamChannels[serverUrl] = new BehaviorSubject(0);
    }
    return loadingTeamChannels[serverUrl];
};

export const setTeamLoading = (serverUrl: string, loading: boolean) => {
    const subject = getLoadingTeamChannelsSubject(serverUrl);
    const newValue = subject.value + (loading ? 1 : -1);
    captureMessage(`[Étape 33/35] [setTeamLoading] ${serverUrl}: loading=${loading}, newValue=${newValue}, prevValue=${subject.value}`);
    logDebug('[setTeamLoading]', {serverUrl, loading, newValue, prevValue: subject.value});
    subject.next(newValue);
};
