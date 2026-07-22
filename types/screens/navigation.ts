// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {Screens} from '@constants';

export type NavigationButton = {
    id: string;
    icon?: unknown;
    testID?: string;
    text?: string;
    [key: string]: any;
};

export type NavigationOptions = Record<string, any>;
export type ImageResource = unknown;
export type OptionsTopBarButton = NavigationButton;
export type Options = NavigationOptions;

export type NavButtons = {
    leftButtons?: NavigationButton[];
    rightButtons?: NavigationButton[];
}

type ScreenKeys = keyof typeof Screens;
export type AvailableScreens = typeof Screens[ScreenKeys];
