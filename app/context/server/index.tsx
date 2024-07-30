// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {createContext, useContext} from 'react';

type WithServerUrlProps = {
    serverUrl: string;
}

type GetProps<C> = C extends React.ComponentType<infer P & WithServerUrlProps> ? P : never

type ServerContext = {
    id: string;
    url: string;
    displayName: string;
}

const ServerContext = createContext<ServerContext>({id: '', url: '', displayName: ''});

export function withServerUrl<C extends React.ComponentType<P>, P = GetProps<C>>(Component: C) {
    return function ServerUrlComponent(props: JSX.LibraryManagedAttributes<C, P>) {
        return (
            <ServerContext.Consumer>
                {(server: ServerContext) => (
                    <Component
                        {...props}
                        serverUrl={server.url}
                    />
                )}
            </ServerContext.Consumer>
        );
    };
}

export const useServerId = () => useContext(ServerContext).id;
export const useServerUrl = () => useContext(ServerContext).url;
export const useServerDisplayName = () => useContext(ServerContext).displayName;

export default ServerContext;
