// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {renderHook, act, waitFor} from '@testing-library/react-native';

import {useConnectionBanner} from './use_connection_banner';

import type {NetworkPerformanceState} from '@managers/network_performance_manager';
import type {NetInfoState} from '@react-native-community/netinfo';
import type {IntlShape} from 'react-intl';

jest.mock('@utils/sentry', () => ({
    captureMessage: jest.fn(),
}));

const createMockIntl = (): IntlShape => ({
    formatMessage: jest.fn(({defaultMessage}) => defaultMessage || ''),
    formatDate: jest.fn(),
    formatTime: jest.fn(),
    formatNumber: jest.fn(),
    formatPlural: jest.fn(),
    formatList: jest.fn(),
    formatDisplayName: jest.fn(),
} as unknown as IntlShape);

const createMockNetInfo = (isInternetReachable: boolean | null = true): NetInfoState => ({
    type: 'wifi',
    isConnected: true,
    isInternetReachable,
    details: {
        ssid: 'test-network',
        bssid: null,
        strength: 100,
        ipAddress: '192.168.1.1',
        subnet: '255.255.255.0',
        frequency: 2400,
        linkSpeed: 100,
        rxLinkSpeed: null,
        txLinkSpeed: null,
        isConnectionExpensive: false,
    },
} as NetInfoState);

describe('useConnectionBanner', () => {
    let mockIntl: IntlShape;

    beforeEach(() => {
        mockIntl = createMockIntl();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('initial session behavior', () => {
        it('should show disconnection banner immediately during initial session', async () => {
            const {result} = renderHook(() => useConnectionBanner({
                websocketState: 'not_connected' as WebsocketConnectedState,
                networkPerformanceState: 'normal' as NetworkPerformanceState,
                netInfo: createMockNetInfo(),
                appState: 'active',
                intl: mockIntl,
            }));

            await waitFor(() => {
                expect(result.current.visible).toBe(true);
                expect(result.current.bannerText).toBe('Unable to connect to network');
            });
        });

        it('should show connecting banner immediately during initial session', async () => {
            const {result} = renderHook(() => useConnectionBanner({
                websocketState: 'connecting' as WebsocketConnectedState,
                networkPerformanceState: 'normal' as NetworkPerformanceState,
                netInfo: createMockNetInfo(),
                appState: 'active',
                intl: mockIntl,
            }));

            await waitFor(() => {
                expect(result.current.visible).toBe(true);
                expect(result.current.bannerText).toBe('Connecting...');
            });
        });

        it('should show internet unreachable banner even during initial session', async () => {
            const {result} = renderHook(() => useConnectionBanner({
                websocketState: 'not_connected' as WebsocketConnectedState,
                networkPerformanceState: 'normal' as NetworkPerformanceState,
                netInfo: createMockNetInfo(false),
                appState: 'active',
                intl: mockIntl,
            }));

            await waitFor(() => {
                expect(result.current.visible).toBe(true);
                expect(result.current.bannerText).toBe('The server is not reachable');
            });
        });
    });

    describe('persistent banners', () => {
        it('should keep disconnection banner visible while not connected', () => {
            jest.useFakeTimers({doNotFake: ['nextTick']});

            const {result} = renderHook(() => useConnectionBanner({
                websocketState: 'not_connected' as WebsocketConnectedState,
                networkPerformanceState: 'normal' as NetworkPerformanceState,
                netInfo: createMockNetInfo(),
                appState: 'active',
                intl: mockIntl,
            }));

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('Unable to connect to network');

            // Advance past auto-close timeout
            act(() => {
                jest.advanceTimersByTime(3000);
            });

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('Unable to connect to network');

        });

        it('should keep connecting banner visible while connecting', () => {
            jest.useFakeTimers({doNotFake: ['nextTick']});

            const {result} = renderHook(() => useConnectionBanner({
                websocketState: 'connecting' as WebsocketConnectedState,
                networkPerformanceState: 'normal' as NetworkPerformanceState,
                netInfo: createMockNetInfo(),
                appState: 'active',
                intl: mockIntl,
            }));

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('Connecting...');

            // Advance past auto-close timeout
            act(() => {
                jest.advanceTimersByTime(3000);
            });

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('Connecting...');

        });

        it('should keep internet unreachable banner visible while unreachable', () => {
            jest.useFakeTimers({doNotFake: ['nextTick']});

            const {result} = renderHook(() => useConnectionBanner({
                websocketState: 'connected' as WebsocketConnectedState,
                networkPerformanceState: 'normal' as NetworkPerformanceState,
                netInfo: createMockNetInfo(false),
                appState: 'active',
                intl: mockIntl,
            }));

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('The server is not reachable');

            // Advance past auto-close timeout
            act(() => {
                jest.advanceTimersByTime(3000);
            });

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('The server is not reachable');

        });

        it('should keep slow network banner visible while network is slow', () => {
            jest.useFakeTimers({doNotFake: ['nextTick']});

            const {result} = renderHook(() => useConnectionBanner({
                websocketState: 'connected' as WebsocketConnectedState,
                networkPerformanceState: 'slow' as NetworkPerformanceState,
                netInfo: createMockNetInfo(),
                appState: 'active',
                intl: mockIntl,
            }));

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('Limited network connection');

            // Advance past auto-close timeout
            act(() => {
                jest.advanceTimersByTime(3000);
            });

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('Limited network connection');

        });
    });

    describe('state transitions', () => {
        it('should show connection restored banner on reconnection', async () => {
            const {result, rerender} = renderHook(
                (props) => useConnectionBanner(props),
                {
                    initialProps: {
                        websocketState: 'not_connected' as WebsocketConnectedState,
                        networkPerformanceState: 'normal' as NetworkPerformanceState,
                        netInfo: createMockNetInfo(),
                        appState: 'active',
                        intl: mockIntl,
                    },
                },
            );

            await waitFor(() => {
                expect(result.current.visible).toBe(true);
                expect(result.current.bannerText).toBe('Unable to connect to network');
            });

            // Reconnect - should show "Connection restored"
            act(() => {
                rerender({
                    websocketState: 'connected' as WebsocketConnectedState,
                    networkPerformanceState: 'normal' as NetworkPerformanceState,
                    netInfo: createMockNetInfo(),
                    appState: 'active',
                    intl: mockIntl,
                });
            });

            await waitFor(() => {
                expect(result.current.visible).toBe(true);
                expect(result.current.bannerText).toBe('Connection restored');
                expect(result.current.isShowingConnectedBanner).toBe(true);
            });
        });

        it('should auto-close connection restored banner after 2 seconds', () => {
            jest.useFakeTimers({doNotFake: ['nextTick']});

            const {result, rerender} = renderHook(
                (props) => useConnectionBanner(props),
                {
                    initialProps: {
                        websocketState: 'not_connected' as WebsocketConnectedState,
                        networkPerformanceState: 'normal' as NetworkPerformanceState,
                        netInfo: createMockNetInfo(),
                        appState: 'active',
                        intl: mockIntl,
                    },
                },
            );

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('Unable to connect to network');

            // Reconnect - should show "Connection restored"
            act(() => {
                rerender({
                    websocketState: 'connected' as WebsocketConnectedState,
                    networkPerformanceState: 'normal' as NetworkPerformanceState,
                    netInfo: createMockNetInfo(),
                    appState: 'active',
                    intl: mockIntl,
                });
            });

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('Connection restored');
            expect(result.current.isShowingConnectedBanner).toBe(true);

            // Wait for auto-close
            act(() => {
                jest.advanceTimersByTime(2100);
            });

            expect(result.current.visible).toBe(false);
            expect(result.current.isShowingConnectedBanner).toBe(false);

        });

        it('should reset connected banner state when network drops during auto-close window', () => {
            jest.useFakeTimers({doNotFake: ['nextTick']});

            const {result, rerender} = renderHook(
                (props) => useConnectionBanner(props),
                {
                    initialProps: {
                        websocketState: 'not_connected' as WebsocketConnectedState,
                        networkPerformanceState: 'normal' as NetworkPerformanceState,
                        netInfo: createMockNetInfo(),
                        appState: 'active',
                        intl: mockIntl,
                    },
                },
            );

            // Reconnect -> shows 'Connection restored' with 2s auto-close
            act(() => {
                rerender({
                    websocketState: 'connected' as WebsocketConnectedState,
                    networkPerformanceState: 'normal' as NetworkPerformanceState,
                    netInfo: createMockNetInfo(),
                    appState: 'active',
                    intl: mockIntl,
                });
            });

            expect(result.current.isShowingConnectedBanner).toBe(true);

            // Network drops during the 2s window
            act(() => {
                rerender({
                    websocketState: 'not_connected' as WebsocketConnectedState,
                    networkPerformanceState: 'normal' as NetworkPerformanceState,
                    netInfo: createMockNetInfo(),
                    appState: 'active',
                    intl: mockIntl,
                });
            });

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('Unable to connect to network');
            expect(result.current.isShowingConnectedBanner).toBe(false);

        });

        it('should hide banner when problem is resolved', () => {
            jest.useFakeTimers({doNotFake: ['nextTick']});

            const {result, rerender} = renderHook(
                (props) => useConnectionBanner(props),
                {
                    initialProps: {
                        websocketState: 'not_connected' as WebsocketConnectedState,
                        networkPerformanceState: 'normal' as NetworkPerformanceState,
                        netInfo: createMockNetInfo(),
                        appState: 'active',
                        intl: mockIntl,
                    },
                },
            );

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('Unable to connect to network');

            // Internet comes back and websocket connects
            act(() => {
                rerender({
                    websocketState: 'connected' as WebsocketConnectedState,
                    networkPerformanceState: 'normal' as NetworkPerformanceState,
                    netInfo: createMockNetInfo(true),
                    appState: 'active',
                    intl: mockIntl,
                });
            });

            expect(result.current.visible).toBe(true);
            expect(result.current.bannerText).toBe('Connection restored');

            act(() => {
                jest.advanceTimersByTime(2100);
            });

            expect(result.current.visible).toBe(false);

        });
    });

    describe('banner priorities', () => {
        it('should prioritize internet unreachable over disconnected', async () => {
            const {result} = renderHook(() => useConnectionBanner({
                websocketState: 'not_connected' as WebsocketConnectedState,
                networkPerformanceState: 'normal' as NetworkPerformanceState,
                netInfo: createMockNetInfo(false),
                appState: 'active',
                intl: mockIntl,
            }));

            await waitFor(() => {
                expect(result.current.visible).toBe(true);
                expect(result.current.bannerText).toBe('The server is not reachable');
            });
        });

        it('should show slow network banner when network is slow', async () => {
            const {result} = renderHook(() => useConnectionBanner({
                websocketState: 'connected' as WebsocketConnectedState,
                networkPerformanceState: 'slow' as NetworkPerformanceState,
                netInfo: createMockNetInfo(),
                appState: 'active',
                intl: mockIntl,
            }));

            await waitFor(() => {
                expect(result.current.visible).toBe(true);
                expect(result.current.bannerText).toBe('Limited network connection');
            });
        });

        it('should prioritize internet unreachable over slow network', async () => {
            const {result} = renderHook(() => useConnectionBanner({
                websocketState: 'connected' as WebsocketConnectedState,
                networkPerformanceState: 'slow' as NetworkPerformanceState,
                netInfo: createMockNetInfo(false),
                appState: 'active',
                intl: mockIntl,
            }));

            await waitFor(() => {
                expect(result.current.visible).toBe(true);
                expect(result.current.bannerText).toBe('The server is not reachable');
            });
        });

        it('should prioritize disconnected over slow network', async () => {
            const {result} = renderHook(() => useConnectionBanner({
                websocketState: 'not_connected' as WebsocketConnectedState,
                networkPerformanceState: 'slow' as NetworkPerformanceState,
                netInfo: createMockNetInfo(),
                appState: 'active',
                intl: mockIntl,
            }));

            await waitFor(() => {
                expect(result.current.visible).toBe(true);
                expect(result.current.bannerText).toBe('Unable to connect to network');
            });
        });
    });

    describe('app state changes', () => {
        it('should hide banner when app goes to background', async () => {
            const {result, rerender} = renderHook(
                ({appState, ...rest}) => useConnectionBanner({
                    appState,
                    ...rest,
                }),
                {
                    initialProps: {
                        websocketState: 'not_connected' as WebsocketConnectedState,
                        networkPerformanceState: 'normal' as NetworkPerformanceState,
                        netInfo: createMockNetInfo(false),
                        appState: 'active',
                        intl: mockIntl,
                    },
                },
            );

            await waitFor(() => {
                expect(result.current.visible).toBe(true);
            });

            // Go to background
            act(() => {
                rerender({
                    websocketState: 'not_connected' as WebsocketConnectedState,
                    networkPerformanceState: 'normal' as NetworkPerformanceState,
                    netInfo: createMockNetInfo(false),
                    appState: 'background',
                    intl: mockIntl,
                });
            });

            await waitFor(() => {
                expect(result.current.visible).toBe(false);
                expect(result.current.bannerText).toBe('');
            });
        });

        it('should show slow banner again when returning from background to active', async () => {
            const {result, rerender} = renderHook(
                ({appState, ...rest}) => useConnectionBanner({
                    appState,
                    ...rest,
                }),
                {
                    initialProps: {
                        websocketState: 'connected' as WebsocketConnectedState,
                        networkPerformanceState: 'slow' as NetworkPerformanceState,
                        netInfo: createMockNetInfo(),
                        appState: 'active',
                        intl: mockIntl,
                    },
                },
            );

            await waitFor(() => {
                expect(result.current.visible).toBe(true);
                expect(result.current.bannerText).toBe('Limited network connection');
            });

            // Go to background
            act(() => {
                rerender({
                    websocketState: 'connected' as WebsocketConnectedState,
                    networkPerformanceState: 'slow' as NetworkPerformanceState,
                    netInfo: createMockNetInfo(),
                    appState: 'background',
                    intl: mockIntl,
                });
            });

            expect(result.current.visible).toBe(false);

            // Come back to active - should show slow banner again
            act(() => {
                rerender({
                    websocketState: 'connected' as WebsocketConnectedState,
                    networkPerformanceState: 'slow' as NetworkPerformanceState,
                    netInfo: createMockNetInfo(),
                    appState: 'active',
                    intl: mockIntl,
                });
            });

            await waitFor(() => {
                expect(result.current.visible).toBe(true);
                expect(result.current.bannerText).toBe('Limited network connection');
            });
        });

        it('should not show connection restored banner when returning from background if websocket stayed connected', async () => {
            const {result, rerender} = renderHook(
                ({appState, ...rest}) => useConnectionBanner({
                    appState,
                    ...rest,
                }),
                {
                    initialProps: {
                        websocketState: 'connected' as WebsocketConnectedState,
                        networkPerformanceState: 'normal' as NetworkPerformanceState,
                        netInfo: createMockNetInfo(),
                        appState: 'active',
                        intl: mockIntl,
                    },
                },
            );

            await waitFor(() => {
                expect(result.current.visible).toBe(false);
            });

            // Go to background
            act(() => {
                rerender({
                    websocketState: 'connected' as WebsocketConnectedState,
                    networkPerformanceState: 'normal' as NetworkPerformanceState,
                    netInfo: createMockNetInfo(),
                    appState: 'background',
                    intl: mockIntl,
                });
            });

            // Come back to active
            act(() => {
                rerender({
                    websocketState: 'connected' as WebsocketConnectedState,
                    networkPerformanceState: 'normal' as NetworkPerformanceState,
                    netInfo: createMockNetInfo(),
                    appState: 'active',
                    intl: mockIntl,
                });
            });

            await waitFor(() => {
                expect(result.current.visible).toBe(false);
                expect(result.current.bannerText).toBe('');
                expect(result.current.isShowingConnectedBanner).toBe(false);
            });
        });
    });
});
