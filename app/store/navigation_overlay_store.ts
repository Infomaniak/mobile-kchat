// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {AvailableScreens, NavigationOptions} from '@typings/screens/navigation';

type Listener = () => void;

export type NavigationOverlayState = {
    navigationOptions?: NavigationOptions;
    props?: Record<string, unknown>;
    screen?: AvailableScreens;
};

class NavigationOverlayStore {
    private listeners = new Set<Listener>();
    private state: NavigationOverlayState = {};

    clear = (screen?: AvailableScreens) => {
        if (!screen && !this.state.screen) {
            return false;
        }

        if (screen && this.state.screen !== screen) {
            return false;
        }

        this.state = {};
        this.notify();
        return true;
    };

    getState = () => this.state;

    isActive = (screen?: AvailableScreens) => {
        return Boolean(screen && this.state.screen === screen);
    };

    setState = (state: NavigationOverlayState) => {
        this.state = state;
        this.notify();
    };

    subscribe = (listener: Listener) => {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    };

    private notify() {
        this.listeners.forEach((listener) => listener());
    }
}

export default new NavigationOverlayStore();
