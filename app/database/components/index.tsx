// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {DatabaseProvider} from '@nozbe/watermelondb/react';
import React, {type ComponentType, useEffect, useState, type ComponentProps} from 'react';

import {AudioPlayerProvider} from '@context/audio_player';
import DeviceInfoProvider from '@context/device';
import ServerUrlProvider from '@context/server';
import ThemeProvider from '@context/theme';
import UserLocaleProvider from '@context/user_locale';
import DatabaseManager from '@database/manager';
import {subscribeActiveServers} from '@database/subscription/servers';
import {secureGetFromRecord} from '@utils/types';

import type {Database} from '@nozbe/watermelondb';
import type ServersModel from '@typings/database/models/app/servers';

type State = {
    database: Database;
    server: ComponentProps<typeof ServerUrlProvider>['server'];
};

export function withServerDatabase<T extends JSX.IntrinsicAttributes>(Component: ComponentType<T>): ComponentType<T> {
    return function ServerDatabaseComponent(props: T) {
        const [state, setState] = useState<State | undefined>();

        const observer = (servers: ServersModel[]) => {
            const server = servers?.length ? servers.reduce((a, b) =>
                (b.lastActiveAt > a.lastActiveAt ? b : a),
            ) : undefined;

            if (server) {
                const database =
                    secureGetFromRecord(DatabaseManager.serverDatabases, server.url)?.database;

                if (database) {
                    setState({
                        database,
                        server: {
                            id: server.identifier,
                            url: server.url,
                            displayName: server.displayName,
                        },
                    });
                }
            } else {
                setState(undefined);
            }
        };

        useEffect(() => {
            const subscription = subscribeActiveServers(observer);

            return () => {
                subscription?.unsubscribe();
            };
        }, []);

        if (!state?.database) {
            return null;
        }

        return (
            <DatabaseProvider
                database={state.database}
                key={state.server.url}
            >
                <DeviceInfoProvider>
                    <UserLocaleProvider database={state.database}>
                        <ServerUrlProvider server={state.server}>
                            <ThemeProvider database={state.database}>
                                <AudioPlayerProvider>
                                    <Component {...props}/>
                                </AudioPlayerProvider>
                            </ThemeProvider>
                        </ServerUrlProvider>
                    </UserLocaleProvider>
                </DeviceInfoProvider>
            </DatabaseProvider>
        );
    };
}
