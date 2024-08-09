// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {authorize} from 'react-native-app-auth';

import {BASE_LOGIN_URL} from '@client/rest/constants';

const loginUrl = BASE_LOGIN_URL;

const config = {
    serviceConfiguration: {
        authorizationEndpoint: `${loginUrl}/authorize`,
        tokenEndpoint: `${loginUrl}/token`,
    },
    clientId: '20af5539-a4fb-421c-b45a-f43af3d90c14',
    redirectUrl: 'com.infomaniak.chat://oauth2redirect',
    additionalParameters: {hide_create_account: ''},
    iosPrefersEphemeralSession: true,
    scopes: [],
};

export async function login(): Promise<string> {
    const result = await authorize(config);
    return result.accessToken;
}
