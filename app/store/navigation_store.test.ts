// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Screens} from '@constants';

import {NavigationStore} from './navigation_store';

import type {NavigationState as ExpoNavigationState} from '@react-navigation/native';

function createNavigationState(routes: Array<{key: string; name: string; state?: ExpoNavigationState}>): ExpoNavigationState {
    return {
        stale: false,
        type: 'stack',
        key: 'root',
        index: routes.length - 1,
        routeNames: routes.map((r) => r.name),
        routes,
    };
}

function createTabNavigationState(routes: Array<{key: string; name: string; state?: ExpoNavigationState}>, activeIndex: number): ExpoNavigationState {
    return {
        stale: false,
        type: 'tab',
        key: 'tabs',
        index: activeIndex,
        routeNames: routes.map((r) => r.name),
        routes,
    };
}

describe('NavigationStore', () => {
    beforeEach(() => {
        NavigationStore.reset();
    });

    describe('updateFromNavigationState', () => {
        it('should extract screen IDs from navigation state', () => {
            const navState = createNavigationState([
                {key: 'channel-1', name: 'channel'},
                {key: 'thread-2', name: 'thread'},
            ]);

            NavigationStore.updateFromNavigationState(navState);

            expect(NavigationStore.getScreensInStack()).toEqual(['channel', 'thread']);
            expect(NavigationStore.getVisibleScreen()).toBe('thread');
        });

        it('should handle nested navigation states', () => {
            const navState = createNavigationState([
                {
                    key: 'channel-1',
                    name: 'channel',
                    state: createNavigationState([
                        {key: 'post_options-3', name: 'post_options'},
                    ]),
                },
            ]);

            NavigationStore.updateFromNavigationState(navState);

            expect(NavigationStore.getScreensInStack()).toEqual(['channel', 'post_options']);
            expect(NavigationStore.getVisibleScreen()).toBe('post_options');
        });

        it('should handle tab navigator correctly', () => {
            const navState = createTabNavigationState([
                {key: 'home-1', name: 'home'},
                {key: 'account-2', name: 'account'},
                {key: 'search-3', name: 'search'},
            ], 1);

            NavigationStore.updateFromNavigationState(navState);

            expect(NavigationStore.getScreensInStack()).toEqual(['account']);
            expect(NavigationStore.getVisibleScreen()).toBe('account');
        });

        it('should handle group route names', () => {
            const navState = createNavigationState([
                {key: '(modals)/edit_profile-1', name: 'edit_profile'},
            ]);

            NavigationStore.updateFromNavigationState(navState);

            expect(NavigationStore.getScreensInStack()).toEqual(['edit_profile']);
        });

        it('should handle index routes', () => {
            const navState = createNavigationState([
                {key: '(channel_info)/index-1', name: 'index'},
            ]);

            NavigationStore.updateFromNavigationState(navState);

            expect(NavigationStore.getScreensInStack()).toEqual(['(channel_info)']);
        });

        it('should not update if navigation state is unchanged', () => {
            const navState = createNavigationState([
                {key: 'channel-1', name: 'channel'},
            ]);

            NavigationStore.updateFromNavigationState(navState);
            const firstStack = NavigationStore.getScreensInStack();

            NavigationStore.updateFromNavigationState(navState);
            const secondStack = NavigationStore.getScreensInStack();

            expect(secondStack).toEqual(firstStack);
        });
    });

    describe('getVisibleScreen', () => {
        it('should return the last screen in the stack', () => {
            const navState = createNavigationState([
                {key: 'channel-1', name: 'channel'},
                {key: 'thread-2', name: 'thread'},
                {key: 'post_options-3', name: 'post_options'},
            ]);

            NavigationStore.updateFromNavigationState(navState);

            expect(NavigationStore.getVisibleScreen()).toBe('post_options');
        });

        it('should return undefined for empty stack', () => {
            expect(NavigationStore.getVisibleScreen()).toBeUndefined();
        });
    });

    describe('getScreensInStack', () => {
        it('should return all screens in order', () => {
            const navState = createNavigationState([
                {key: 'channel-1', name: 'channel'},
                {key: 'thread-2', name: 'thread'},
            ]);

            NavigationStore.updateFromNavigationState(navState);

            expect(NavigationStore.getScreensInStack()).toEqual(['channel', 'thread']);
        });

        it('should return empty array initially', () => {
            expect(NavigationStore.getScreensInStack()).toEqual([]);
        });
    });

    describe('isScreenInStack', () => {
        it('should return true if screen is in stack', () => {
            const navState = createNavigationState([
                {key: 'channel-1', name: 'channel'},
                {key: 'thread-2', name: 'thread'},
            ]);

            NavigationStore.updateFromNavigationState(navState);

            expect(NavigationStore.isScreenInStack('channel')).toBe(true);
            expect(NavigationStore.isScreenInStack('thread')).toBe(true);
        });

        it('should return false if screen is not in stack', () => {
            const navState = createNavigationState([
                {key: 'channel-1', name: 'channel'},
            ]);

            NavigationStore.updateFromNavigationState(navState);

            expect(NavigationStore.isScreenInStack('thread')).toBe(false);
        });
    });

    describe('isModalOpen', () => {
        it('should return true when modals group is in stack', () => {
            const navState = createNavigationState([
                {key: 'channel-1', name: 'channel'},
                {key: '(modals)-2', name: '(modals)'},
            ]);

            NavigationStore.updateFromNavigationState(navState);

            expect(NavigationStore.isModalOpen()).toBe(true);
        });

        it('should return false when no modals are open', () => {
            const navState = createNavigationState([
                {key: 'channel-1', name: 'channel'},
            ]);

            NavigationStore.updateFromNavigationState(navState);

            expect(NavigationStore.isModalOpen()).toBe(false);
        });
    });

    describe('reset', () => {
        it('should clear all state', () => {
            const navState = createNavigationState([
                {key: 'channel-1', name: 'channel'},
            ]);

            NavigationStore.updateFromNavigationState(navState);
            NavigationStore.setToSOpen(true);

            expect(NavigationStore.getScreensInStack()).toEqual(['channel']);
            expect(NavigationStore.isToSOpen()).toBe(true);

            NavigationStore.reset();

            expect(NavigationStore.getScreensInStack()).toEqual([]);
            expect(NavigationStore.getVisibleScreen()).toBeUndefined();
            expect(NavigationStore.isToSOpen()).toBe(false);
        });
    });

    describe('ToS management', () => {
        it('should manage ToS state correctly', () => {
            expect(NavigationStore.isToSOpen()).toBe(false);

            NavigationStore.setToSOpen(true);
            expect(NavigationStore.isToSOpen()).toBe(true);

            NavigationStore.setToSOpen(false);
            expect(NavigationStore.isToSOpen()).toBe(false);
        });
    });

    describe('screen management', () => {
        it('should add and get screens correctly', () => {
            NavigationStore.addScreenToStack(Screens.ABOUT);
            NavigationStore.addScreenToStack(Screens.ACCOUNT);

            expect(NavigationStore.getScreensInStack()).toEqual([Screens.ABOUT, Screens.ACCOUNT]);
            expect(NavigationStore.getVisibleScreen()).toBe(Screens.ACCOUNT);
        });

        it('should remove screens correctly', () => {
            NavigationStore.addScreenToStack(Screens.ABOUT);
            NavigationStore.addScreenToStack(Screens.ACCOUNT);
            NavigationStore.removeScreenFromStack(Screens.ACCOUNT);

            expect(NavigationStore.getScreensInStack()).toEqual([Screens.ABOUT]);
            expect(NavigationStore.getVisibleScreen()).toBe(Screens.ABOUT);
        });

        it('should clear screens correctly', () => {
            NavigationStore.addScreenToStack(Screens.ABOUT);
            NavigationStore.addScreenToStack(Screens.ACCOUNT);
            NavigationStore.clearScreensFromStack();

            expect(NavigationStore.getScreensInStack()).toEqual([]);
            expect(NavigationStore.getVisibleScreen()).toBeUndefined();
        });

        it('should pop to screen correctly', () => {
            NavigationStore.addScreenToStack(Screens.ABOUT);
            NavigationStore.addScreenToStack(Screens.ACCOUNT);
            NavigationStore.addScreenToStack(Screens.CHANNEL);
            NavigationStore.popTo(Screens.ABOUT);

            expect(NavigationStore.getScreensInStack()).toEqual([Screens.ABOUT]);
            expect(NavigationStore.getVisibleScreen()).toBe(Screens.ABOUT);
        });
    });

    describe('tab management', () => {
        it('should return Home as visible tab', () => {
            expect(NavigationStore.getVisibleTab()).toBe('Home');
        });
    });

    describe('observables', () => {
        it('should notify subscribers of screen changes via state$', () => {
            const mockNext = jest.fn();
            const subscription = NavigationStore.state$.subscribe(mockNext);

            const navState = createNavigationState([
                {key: 'channel-1', name: 'channel'},
            ]);

            NavigationStore.updateFromNavigationState(navState);

            expect(mockNext).toHaveBeenCalledWith({
                screenStack: ['channel'],
            });

            subscription.unsubscribe();
        });

        it('should notify subscribers of current screen changes via currentScreen$', () => {
            const mockNext = jest.fn();
            const subscription = NavigationStore.currentScreen$.subscribe(mockNext);

            const navState1 = createNavigationState([
                {key: 'channel-1', name: 'channel'},
            ]);
            NavigationStore.updateFromNavigationState(navState1);

            const navState2 = createNavigationState([
                {key: 'channel-1', name: 'channel'},
                {key: 'thread-2', name: 'thread'},
            ]);
            NavigationStore.updateFromNavigationState(navState2);

            expect(mockNext).toHaveBeenCalledWith('channel');
            expect(mockNext).toHaveBeenCalledWith('thread');

            subscription.unsubscribe();
        });

        it('should not notify currentScreen$ if visible screen did not change', () => {
            const mockNext = jest.fn();
            const subscription = NavigationStore.currentScreen$.subscribe(mockNext);

            const navState = createNavigationState([
                {key: 'channel-1', name: 'channel'},
            ]);

            NavigationStore.updateFromNavigationState(navState);
            NavigationStore.updateFromNavigationState(navState);

            expect(mockNext).toHaveBeenCalledTimes(2);
            expect(mockNext).toHaveBeenNthCalledWith(1, undefined);
            expect(mockNext).toHaveBeenNthCalledWith(2, 'channel');

            subscription.unsubscribe();
        });
    });

    describe('subject management', () => {
        it('should notify subscribers of screen changes', () => {
            const mockNext = jest.fn();
            const subscription = NavigationStore.getSubject().subscribe({
                next: mockNext,
            });

            NavigationStore.addScreenToStack(Screens.ABOUT);
            expect(mockNext).toHaveBeenCalledWith(Screens.ABOUT);

            NavigationStore.removeScreenFromStack(Screens.ABOUT);
            expect(mockNext).toHaveBeenCalledWith(undefined);

            subscription.unsubscribe();
        });
    });

    describe('async wait utilities', () => {
        beforeEach(() => {
            jest.useFakeTimers({doNotFake: ['nextTick', 'setImmediate']});
        });

        afterEach(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        it('should resolve waitUntilScreenHasLoaded when screen is added', async () => {
            const promise = NavigationStore.waitUntilScreenHasLoaded(Screens.ABOUT);

            const navState = createNavigationState([
                {key: `${Screens.ABOUT}-1`, name: Screens.ABOUT},
            ]);
            NavigationStore.updateFromNavigationState(navState);

            await promise;
            expect(NavigationStore.isScreenInStack(Screens.ABOUT)).toBe(true);
        });

        it('should resolve immediately if screen is already in stack', async () => {
            const navState = createNavigationState([
                {key: `${Screens.ABOUT}-1`, name: Screens.ABOUT},
            ]);
            NavigationStore.updateFromNavigationState(navState);

            await NavigationStore.waitUntilScreenHasLoaded(Screens.ABOUT);
            expect(NavigationStore.isScreenInStack(Screens.ABOUT)).toBe(true);
        });

        it('should resolve waitUntilScreenIsTop when screen becomes visible', async () => {
            const navState1 = createNavigationState([
                {key: `${Screens.CHANNEL}-1`, name: Screens.CHANNEL},
            ]);
            NavigationStore.updateFromNavigationState(navState1);

            const promise = NavigationStore.waitUntilScreenIsTop(Screens.ABOUT);

            const navState2 = createNavigationState([
                {key: `${Screens.CHANNEL}-1`, name: Screens.CHANNEL},
                {key: `${Screens.ABOUT}-2`, name: Screens.ABOUT},
            ]);
            NavigationStore.updateFromNavigationState(navState2);

            await promise;
            expect(NavigationStore.getVisibleScreen()).toBe(Screens.ABOUT);
        });

        it('should resolve immediately if screen is already top', async () => {
            const navState = createNavigationState([
                {key: `${Screens.ABOUT}-1`, name: Screens.ABOUT},
            ]);
            NavigationStore.updateFromNavigationState(navState);

            await NavigationStore.waitUntilScreenIsTop(Screens.ABOUT);
            expect(NavigationStore.getVisibleScreen()).toBe(Screens.ABOUT);
        });

        it('should resolve waitUntilScreensIsRemoved when screen is removed', async () => {
            const navState1 = createNavigationState([
                {key: `${Screens.ABOUT}-1`, name: Screens.ABOUT},
            ]);
            NavigationStore.updateFromNavigationState(navState1);

            const promise = NavigationStore.waitUntilScreensIsRemoved(Screens.ABOUT);

            const navState2 = createNavigationState([
                {key: `${Screens.CHANNEL}-1`, name: Screens.CHANNEL},
            ]);
            NavigationStore.updateFromNavigationState(navState2);

            await promise;
            expect(NavigationStore.isScreenInStack(Screens.ABOUT)).toBe(false);
        });

        it('should resolve immediately if screen is not in stack', async () => {
            await NavigationStore.waitUntilScreensIsRemoved(Screens.ABOUT);
            expect(NavigationStore.isScreenInStack(Screens.ABOUT)).toBe(false);
        });
    });
});
