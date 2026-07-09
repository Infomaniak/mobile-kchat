// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useCallback, useEffect, useRef, useState} from 'react';

import useDidUpdate from '@hooks/did_update';

import type {NetworkPerformanceState} from '@managers/network_performance_manager';
import type {NetInfoState} from '@react-native-community/netinfo';
import type {IntlShape} from 'react-intl';

const CLOSE_TIMEOUT_DURATION_MS = 2000;

const clearTimeoutRef = (ref: React.MutableRefObject<NodeJS.Timeout | null | undefined>) => {
    if (ref.current) {
        clearTimeout(ref.current);
        ref.current = null;
    }
};

type UseConnectionBannerParams = {
    websocketState: WebsocketConnectedState;
    networkPerformanceState: NetworkPerformanceState;
    netInfo: NetInfoState;
    appState: string;
    intl: IntlShape;
};

type UseConnectionBannerReturn = {
    visible: boolean;
    bannerText: string;
    isShowingConnectedBanner: boolean;
};

export const useConnectionBanner = ({
    websocketState,
    networkPerformanceState,
    netInfo,
    appState,
    intl,
}: UseConnectionBannerParams): UseConnectionBannerReturn => {
    const closeTimeout = useRef<NodeJS.Timeout | null>();
    const previousWebsocketState = useRef<WebsocketConnectedState>(websocketState);

    const [visible, setVisible] = useState(false);
    const [bannerText, setBannerText] = useState('');
    const [isShowingConnectedBanner, setIsShowingConnectedBanner] = useState(false);

    const closeCallback = useCallback(() => {
        setVisible(false);
        clearTimeoutRef(closeTimeout);
    }, []);

    const openCallback = useCallback(() => {
        clearTimeoutRef(closeTimeout);
        setVisible(true);
    }, []);

    const handleDisconnectedState = useCallback((): boolean => {
        if (websocketState === 'not_connected') {
            previousWebsocketState.current = 'not_connected';
            setBannerText(intl.formatMessage({id: 'connection_banner.not_connected', defaultMessage: 'Unable to connect to network'}));
            openCallback();
            return true;
        }
        return false;
    }, [websocketState, openCallback, intl]);

    const handleInternetUnreachableState = useCallback((): boolean => {
        if (netInfo.isInternetReachable === false) {
            setBannerText(intl.formatMessage({id: 'connection_banner.not_reachable', defaultMessage: 'The server is not reachable'}));
            openCallback();
            return true;
        }
        return false;
    }, [netInfo.isInternetReachable, intl, openCallback]);

    const handleSlowNetworkState = useCallback((): boolean => {
        if (networkPerformanceState === 'slow') {
            setBannerText(intl.formatMessage({id: 'connection_banner.slow', defaultMessage: 'Limited network connection'}));
            openCallback();
            return true;
        }
        return false;
    }, [networkPerformanceState, intl, openCallback]);

    const handleConnectedState = useCallback((): boolean => {
        if (websocketState === 'connected' && previousWebsocketState.current !== 'connected') {
            previousWebsocketState.current = 'connected';
            setIsShowingConnectedBanner(true);
            setBannerText(intl.formatMessage({id: 'connection_banner.connected', defaultMessage: 'Connection restored'}));
            openCallback();
            closeTimeout.current = setTimeout(() => {
                closeCallback();
                setIsShowingConnectedBanner(false);
            }, CLOSE_TIMEOUT_DURATION_MS);
            return true;
        }
        return false;
    }, [websocketState, intl, openCallback, closeCallback]);

    const handleConnectingState = useCallback((): boolean => {
        if (websocketState === 'connecting') {
            setBannerText(intl.formatMessage({id: 'connection_banner.connecting', defaultMessage: 'Connecting...'}));
            openCallback();
            previousWebsocketState.current = 'connecting';
            return true;
        }
        return false;
    }, [websocketState, intl, openCallback]);

    useEffect(() => {
        return () => {
            clearTimeoutRef(closeTimeout);
        };
    }, []);

    useEffect(() => {
        if (appState !== 'active') {
            return;
        }

        const priorities = () => {
            const shouldHideBanner =
                handleInternetUnreachableState() ||
                handleDisconnectedState() ||
                handleSlowNetworkState() ||
                handleConnectingState();

            if (shouldHideBanner) {
                setIsShowingConnectedBanner(false);
                return;
            }

            handleConnectedState();
        };

        priorities();

    // We omit 'visible' from dependencies because we do not want
    // to show again the banner the moment the banner is closed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        handleInternetUnreachableState,
        handleDisconnectedState,
        handleSlowNetworkState,
        handleConnectedState,
        handleConnectingState,
        appState,
    ]);

    useDidUpdate(() => {
        if (appState !== 'active') {
            setVisible(false);
            setBannerText('');
            clearTimeoutRef(closeTimeout);
            setIsShowingConnectedBanner(false);
        }
    }, [appState]);

    return {
        visible,
        bannerText,
        isShowingConnectedBanner,
    };
};

