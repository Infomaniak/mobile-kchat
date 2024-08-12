// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BehaviorSubject} from 'rxjs';

import {DefaultGlobalCallsState, type GlobalCallsState} from '@calls/types/calls';

const globalStateSubject = new BehaviorSubject(DefaultGlobalCallsState);

export const getGlobalCallsState = () => {
    return globalStateSubject.value;
};

export const setGlobalCallsState = (globalState: GlobalCallsState) => {
    globalStateSubject.next(globalState);
};

export const observeGlobalCallsState = () => {
    return globalStateSubject.asObservable();
};
