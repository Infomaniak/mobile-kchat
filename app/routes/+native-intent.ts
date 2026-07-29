// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Linking} from 'react-native';

import {DEFAULT_LOCALE} from '@i18n';
import {alertInvalidDeepLink, parseAndHandleDeepLink} from '@utils/deep_link';
import {getIntlShape} from '@utils/general';

export const addEventListener = () => {
    const handleUrl = async (event: {url: string}) => {
        if (event.url) {
            const {error} = await parseAndHandleDeepLink(
                event.url,
                undefined,
                undefined,
                true,
            );

            if (error) {
                alertInvalidDeepLink(getIntlShape(DEFAULT_LOCALE));
            }
        }
    };

    const subscription = Linking.addEventListener('url', handleUrl);

    return () => {
        subscription.remove();
    };
};

export function redirectSystemPath(options: {path: string; initial: boolean}) {
    return options.path;
}
