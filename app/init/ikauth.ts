// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {authorize, type AuthConfiguration} from 'react-native-app-auth';

import {BASE_LOGIN_URL} from '@client/rest/constants';

const loginUrl = BASE_LOGIN_URL;

const config: Omit<AuthConfiguration, 'scopes'> = {
    serviceConfiguration: {
        authorizationEndpoint: `${loginUrl}/authorize`,
        tokenEndpoint: `${loginUrl}/token`,
    },
    clientId: '20af5539-a4fb-421c-b45a-f43af3d90c14',
    redirectUrl: 'com.infomaniak.chat://oauth2redirect',
    additionalParameters: {
        hide_create_account: '',

        // Force login prompt on Android to prevent auto-login via Chrome session
        // See: https://github.com/FormidableLabs/react-native-app-auth/issues/873
        prompt: 'login',
    },
    iosPrefersEphemeralSession: true,

    // INFOMANIAK: Do not add scopes [], otherwise login
    // will succeed but you won't be able to reconnect when killing
    // re-creating the app
    // scopes: [],
};

export class LoginCancelledError extends Error {
    constructor() {
        super('User cancelled login');
    }
}

export async function login(): Promise<string> {
    try {
        const result = await authorize(config as AuthConfiguration);
        return result.accessToken;
    } catch (error: any) {
        const code = error?.code;
        const message = error?.message?.toLowerCase() || '';
        const rawMessage = error?.message || '';
        const isCancelled =
            code === 'user_cancelled' ||
            code === -3 ||
            code === '-3' ||
            message.includes('cancel') ||
            message.includes('annul') ||
            rawMessage.includes('-3');

        if (isCancelled) {
            throw new LoginCancelledError();
        }
        throw error;
    }
}
