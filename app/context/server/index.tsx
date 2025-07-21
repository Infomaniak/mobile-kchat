// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {createContext, useContext} from 'react';

type WithServerUrlProps = {
    serverUrl: string;
}

type GetProps<C> = C extends React.ComponentType<infer P & WithServerUrlProps> ? P : never

type ServerContextType = {
    id: string;
    displayName: string;
    url: string;
}

type Props = {
    server: ServerContextType;
    children: React.ReactNode;
}

const ServerContext = createContext<ServerContextType>({id: '', displayName: '', url: ''});
const {Provider, Consumer} = ServerContext;

function ServerUrlProvider({server, children}: Props) {
    return (
        <Provider value={server}>{children}</Provider>
    );
}

export function withServerUrl<C extends React.ComponentType<P>, P = GetProps<C>>(Component: C) {
    return function ServerUrlComponent(props: JSX.LibraryManagedAttributes<C, P>) {
        return (
            <Consumer>
                {(server: ServerContextType) => (
                    <Component
                        {...props}
                        serverUrl={server.url}
                    />
                )}
            </Consumer>
        );
    };
}

export const useServerId = () => useContext(ServerContext).id;
export const useServerUrl = () => useContext(ServerContext).url;
export const useServerDisplayName = () => useContext(ServerContext).displayName;

export default ServerUrlProvider;
