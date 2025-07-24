// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import CookieManager from '@react-native-cookies/cookies';
import {useCallback, useEffect, useState} from 'react';
import RNRestart from 'react-native-restart';

import {BASE_SERVER_URL} from '@client/rest/constants';
import {useServerUrl} from '@context/server';
import {useTransientRef} from '@hooks/utils';
import {preventDoubleTap} from '@utils/tap';

const COOKIE_NEXT_NAME = 'KCHAT_NEXT';
const COOKIE_NEXT_USE_WEBKIT = false;

/**
 * Returns [isNext, onNextToggle]
 * isNext is undefined if the current server URL is unrelated to informaniak
 */
export const useNextState = (): [boolean | undefined, () => void] => {
    const serverUrl = useServerUrl();
    const isServerInfomaniak = (/https?:\/\/infomaniak\.kchat/).test(serverUrl);
    const [isNext, setIsNext] = useState(isServerInfomaniak ? false : undefined);
    const isNextRef = useTransientRef(isNext);

    /**
     * Update the KCHAT_NEXT cookie and reload the app
     */
    const onNextToggle = useCallback(preventDoubleTap(() => {
        const expiresDate = new Date();
        expiresDate.setFullYear(expiresDate.getFullYear() + 1);

        CookieManager.set(serverUrl, {
            name: COOKIE_NEXT_NAME,
            value: isNextRef.current ? 'never' : 'always',
            path: '/',
            domain: (BASE_SERVER_URL.indexOf('.preprod.dev.infomaniak.ch') === -1) ? '.infomaniak.com' : '.preprod.dev.infomaniak.ch',
            expires: expiresDate.toISOString().replace(/\dZ$/, '-00:00'),
            secure: true,

            // httpOnly?: boolean;
            // version?: string;
        }, COOKIE_NEXT_USE_WEBKIT);

        // Reload the application
        // Ref. https://www.npmjs.com/package/react-native-restart#usage
        RNRestart.restart();
    }), []);

    /**
     * Lazy compute if we are currently on preprod
     */
    useEffect(() => {
        if (isServerInfomaniak) {
            /* eslint-disable max-nested-callbacks */
            (async () => {
                const cookies = await CookieManager.get(serverUrl, COOKIE_NEXT_USE_WEBKIT);
                const kChatNextCookie = Object.values(cookies).find((c) => c.name.toUpperCase() === COOKIE_NEXT_NAME);

                setIsNext(kChatNextCookie?.value?.toLowerCase() === 'always');
            })();
            /* eslint-enable max-nested-callbacks */
        }
    }, [isServerInfomaniak]);

    return [isNext, onNextToggle];
};
