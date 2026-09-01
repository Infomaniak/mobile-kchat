// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BehaviorSubject} from 'rxjs';

type InAppNotificationConfig = {
    notification: NotificationWithData;
    serverName?: string;
    serverUrl: string;
};

type InAppNotificationState = {
    id: number;
    visible: boolean;
    notification: NotificationWithData | null;
    serverName?: string;
    serverUrl: string;
};

class InAppNotificationStoreSingleton {
    private subject = new BehaviorSubject<InAppNotificationState>({
        id: 0,
        visible: false,
        notification: null,
        serverUrl: '',
    });

    private counter = 0;

    show = (config: InAppNotificationConfig) => {
        this.counter += 1;
        this.subject.next({visible: true, id: this.counter, ...config});
    };

    dismiss = () => {
        this.subject.next({visible: false, id: 0, notification: null, serverUrl: ''});
    };

    observe = () => {
        return this.subject.asObservable();
    };

    getState = () => {
        return this.subject.value;
    };
}

const InAppNotificationStore = new InAppNotificationStoreSingleton();
export default InAppNotificationStore;
