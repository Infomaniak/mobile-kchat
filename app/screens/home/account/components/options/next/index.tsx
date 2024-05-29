// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import CookieManager from '@react-native-cookies/cookies';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {DevSettings, StyleSheet} from 'react-native';

import {useTransientRef} from '@app/hooks/utils';
import {BASE_SERVER_URL} from '@client/rest/constants';
import OptionItem from '@components/option_item';
import {useServerUrl} from '@context/server';
import {preventDoubleTap} from '@utils/tap';

const COLOR = '#7974B4';

const COOKIE_NAME = 'KCHAT_NEXT';
const COOKIE_USE_WEBKIT = false;

const styles = StyleSheet.create({
    labelText: {color: COLOR},
});

const Next = () => {
    const {formatMessage} = useIntl();
    const serverUrl = useServerUrl();
    const isServerInfomaniak = (/https?:\/\/infomaniak\.kchat/).test(serverUrl);
    const [isNext, setIsNext] = useState(false);
    const isNextRef = useTransientRef(isNext);

    /**
     * Update the KCHAT_NEXT cookie and reload the app
     */
    const onNext = useCallback(preventDoubleTap(() => {
        const expiresDate = new Date();
        expiresDate.setFullYear(expiresDate.getFullYear() + 1);

        CookieManager.set(serverUrl, {
            name: COOKIE_NAME,
            value: isNextRef.current ? 'never' : 'always',
            path: '/',
            domain: (BASE_SERVER_URL.indexOf('.preprod.dev.infomaniak.ch') === -1) ? '.infomaniak.com' : '.preprod.dev.infomaniak.ch',
            expires: expiresDate.toISOString().replace(/\dZ$/, '-00:00'),
            secure: true,

            // httpOnly?: boolean;
            // version?: string;
        }, COOKIE_USE_WEBKIT);

        // Reload the application
        // Ref. https://reactnative.dev/docs/devsettings#reload
        DevSettings.reload();
    }), []);

    /**
     * Lazy compute if we are currently on preprod
     */
    useEffect(() => {
        if (isServerInfomaniak) {
            /* eslint-disable max-nested-callbacks */
            (async () => {
                const cookies = await CookieManager.get(serverUrl, COOKIE_USE_WEBKIT);
                const kChatNextCookie = Object.values(cookies).find((c) => c.name.toUpperCase() === COOKIE_NAME);

                setIsNext(kChatNextCookie?.value?.toLowerCase() === 'always');
            })();
            /* eslint-enable max-nested-callbacks */
        }
    }, [isServerInfomaniak]);

    return isServerInfomaniak ? (
        <OptionItem
            action={onNext}

            icon='flag'
            type='default'

            label={formatMessage({
                id: `account.server_${isNext ? '' : 'pre'}prod`,
                defaultMessage: `Switch to ${isNext ? 'STABLE' : 'NEXT'}`,
            })}

            iconColor={COLOR}
            optionLabelTextStyle={styles.labelText}
        />
    ) : null;
};

export default Next;
