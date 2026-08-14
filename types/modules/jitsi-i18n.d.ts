// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

declare module '@jitsi/react-native-sdk/react/features/base/i18n/functions' {
    import {type ComponentType} from 'react';
    import {type WithTranslation} from 'react-i18next';
    export function translate<P extends WithTranslation>(component: ComponentType<P>): ComponentType<P>;
    export function changeLanguageBundle(language: string, url: string, ns?: string): Promise<void>;
    export function translateToHTML(t: Function, key: string, options?: Record<string, unknown>): import('react').ReactElement;
}
