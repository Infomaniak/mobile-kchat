// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useCallback, useEffect, useRef, useState} from 'react';

import useDidUpdate from '@hooks/did_update';
import {logDebug} from '@utils/log';
import {captureMessage} from '@utils/sentry';

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
        logDebug('[ConnectionBanner.closeCallback] Banner hidden');
    }, []);

    const openCallback = useCallback(() => {
        clearTimeoutRef(closeTimeout);
        setVisible(true);
        logDebug('[ConnectionBanner.openCallback] Banner shown');
    }, []);

    const handleDisconnectedState = useCallback((): boolean => {
        if (websocketState === 'not_connected') {
            previousWebsocketState.current = 'not_connected';
            setBannerText(intl.formatMessage({id: 'connection_banner.not_connected', defaultMessage: 'Unable to connect to network'}));
            openCallback();
            captureMessage('[ConnectionBanner] Showing disconnected banner');
            logDebug('[ConnectionBanner.handleDisconnectedState]', {
                websocketState,
                previousWebsocketState: previousWebsocketState.current,
            });
            return true;
        }
        return false;
    }, [websocketState, openCallback, intl]);

    const handleInternetUnreachableState = useCallback((): boolean => {
        if (netInfo.isInternetReachable === false) {
            setBannerText(intl.formatMessage({id: 'connection_banner.not_reachable', defaultMessage: 'The server is not reachable'}));
            openCallback();
            captureMessage('[ConnectionBanner] Showing internet unreachable banner');
            logDebug('[ConnectionBanner.handleInternetUnreachableState]', {
                netInfoReachable: netInfo.isInternetReachable,
            });
            return true;
        }
        return false;
    }, [netInfo.isInternetReachable, intl, openCallback]);

    const handleSlowNetworkState = useCallback((): boolean => {
        if (networkPerformanceState === 'slow') {
            setBannerText(intl.formatMessage({id: 'connection_banner.slow', defaultMessage: 'Limited network connection'}));
            openCallback();
            captureMessage('[ConnectionBanner] Showing slow network banner');
            logDebug('[ConnectionBanner.handleSlowNetworkState]', {
                networkPerformanceState,
            });
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
            captureMessage('[ConnectionBanner] Showing connected banner (auto-close in 2s)');
            logDebug('[ConnectionBanner.handleConnectedState]', {
                websocketState,
                previousWebsocketState: previousWebsocketState.current,
            });
            closeTimeout.current = setTimeout(() => {
                closeCallback();
                setIsShowingConnectedBanner(false);
                captureMessage('[ConnectionBanner] Connected banner auto-closed');
                logDebug('[ConnectionBanner] Connected banner auto-closed after timeout');
            }, CLOSE_TIMEOUT_DURATION_MS);
            return true;
        }
        return false;
    }, [websocketState, intl, openCallback, closeCallback]);

    const handleConnectingState = useCallback((): boolean => {
        if (websocketState === 'connecting') {
            setBannerText(intl.formatMessage({id: 'connection_banner.connecting', defaultMessage: 'Connecting...'}));
            openCallback();
            captureMessage('[ConnectionBanner] Showing connecting banner');
            logDebug('[ConnectionBanner.handleConnectingState]', {
                websocketState,
            });
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

        logDebug('[ConnectionBanner.priorities] Evaluating', {
            websocketState,
            previousWebsocketState: previousWebsocketState.current,
            networkPerformanceState,
            netInfoReachable: netInfo.isInternetReachable,
            appState,
            visible,
            isShowingConnectedBanner,
            hasCloseTimeout: Boolean(closeTimeout.current),
        });

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
            logDebug('[ConnectionBanner] App went to background — resetting banner state');
        }
    }, [appState]);

    return {
        visible,
        bannerText,
        isShowingConnectedBanner,
    };
};

