// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {AvailableScreens, NavButtons, NavigationButton, NavigationOptions} from '@typings/screens/navigation';

export type NavigationHeaderState = {
    backgroundColor?: string;
    buttonColor?: string;
    leftButtons?: NavigationButton[];
    rightButtons?: NavigationButton[];
    textColor?: string;
    title?: string;
    visible?: boolean;
}

type Listener = () => void;

const getTitle = (options: NavigationOptions): string | undefined => {
    if (typeof options.title === 'string') {
        return options.title;
    }

    const title = options.topBar?.title;
    if (typeof title === 'string') {
        return title;
    }

    if (typeof title?.text === 'string') {
        return title.text;
    }

    return undefined;
};

const getHeaderStateFromOptions = (options: NavigationOptions): NavigationHeaderState => {
    const topBar = options.topBar;
    const state: NavigationHeaderState = {};
    const title = getTitle(options);

    if (title !== undefined) {
        state.title = title;
    }

    if (typeof topBar?.visible === 'boolean') {
        state.visible = topBar.visible;
    }

    if (Array.isArray(topBar?.leftButtons)) {
        state.leftButtons = topBar.leftButtons;
    }

    if (Array.isArray(topBar?.rightButtons)) {
        state.rightButtons = topBar.rightButtons;
    }

    if (typeof topBar?.background?.color === 'string') {
        state.backgroundColor = topBar.background.color;
    }

    if (typeof topBar?.title?.color === 'string') {
        state.textColor = topBar.title.color;
    }

    if (typeof topBar?.leftButtonColor === 'string') {
        state.buttonColor = topBar.leftButtonColor;
    }

    if (typeof topBar?.rightButtonColor === 'string') {
        state.buttonColor = topBar.rightButtonColor;
    }

    return state;
};

class NavigationHeaderStore {
    private listeners = new Set<Listener>();
    private states = new Map<AvailableScreens, NavigationHeaderState>();

    subscribe = (listener: Listener) => {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    };

    clear(screen: AvailableScreens) {
        this.states.delete(screen);
        this.notify();
    }

    getState(screen: AvailableScreens): NavigationHeaderState {
        return this.states.get(screen) || {};
    }

    mergeOptions(screen: AvailableScreens, options: NavigationOptions = {}) {
        this.setPartialState(screen, getHeaderStateFromOptions(options));
    }

    setButtons(screen: AvailableScreens, buttons: NavButtons = {leftButtons: [], rightButtons: []}) {
        const state: NavigationHeaderState = {};

        if ('leftButtons' in buttons) {
            state.leftButtons = buttons.leftButtons || [];
        }

        if ('rightButtons' in buttons) {
            state.rightButtons = buttons.rightButtons || [];
        }

        this.setPartialState(screen, state);
    }

    private notify() {
        this.listeners.forEach((listener) => listener());
    }

    private setPartialState(screen: AvailableScreens, state: NavigationHeaderState) {
        this.states.set(screen, {
            ...this.getState(screen),
            ...state,
        });
        this.notify();
    }
}

export default new NavigationHeaderStore();
