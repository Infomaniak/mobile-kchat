// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useEffect, useState} from 'react';
import {BehaviorSubject} from 'rxjs';

import type {NavigationState as ExpoNavigationState, NavigationRoute, ParamListBase} from '@react-navigation/native';
import type {AvailableScreens} from '@typings/screens/navigation';

interface NavigationState {
    screenStack: AvailableScreens[];
}

const initialState: NavigationState = {
    screenStack: [],
};

class NavigationStoreSingleton {
    private stateSubject = new BehaviorSubject<NavigationState>(initialState);
    private screenSubject = new BehaviorSubject<AvailableScreens | undefined>(undefined);
    private tosOpen = false;

    state$ = this.stateSubject.asObservable();
    currentScreen$ = this.screenSubject.asObservable();

    get state() {
        return this.stateSubject.value;
    }

    getVisibleScreen() {
        return this.state.screenStack[this.state.screenStack.length - 1];
    }

    getScreensInStack() {
        return this.state.screenStack;
    }

    isScreenInStack(screenId: AvailableScreens) {
        return this.state.screenStack.includes(screenId);
    }

    isModalOpen(): boolean {
        return this.state.screenStack.includes('(modals)');
    }

    hasModalsOpened(): boolean {
        return this.isModalOpen();
    }

    addScreenToStack(screenId: AvailableScreens) {
        const screenStack = [...this.state.screenStack];
        const index = screenStack.indexOf(screenId);
        if (index > -1) {
            screenStack.splice(index, 1);
        }
        screenStack.push(screenId);
        this.stateSubject.next({...this.state, screenStack});
        this.screenSubject.next(screenId);
    }

    addModalToStack(modalId: AvailableScreens) {
        this.addScreenToStack(modalId);
    }

    removeScreenFromStack(screenId: AvailableScreens) {
        const screenStack = this.state.screenStack.filter((s) => s !== screenId);
        this.stateSubject.next({...this.state, screenStack});
        this.screenSubject.next(screenStack[screenStack.length - 1]);
    }

    removeModalFromStack(modalId: AvailableScreens) {
        this.removeScreenFromStack(modalId);
    }

    clearScreensFromStack() {
        this.stateSubject.next({...this.state, screenStack: []});
        this.screenSubject.next(undefined);
    }

    popTo(screenId: AvailableScreens) {
        const index = this.state.screenStack.indexOf(screenId);
        if (index > -1) {
            const screenStack = this.state.screenStack.slice(0, index + 1);
            this.stateSubject.next({...this.state, screenStack});
            this.screenSubject.next(screenId);
        }
    }

    getVisibleTab() {
        return 'Home';
    }

    setVisibleTap(tab: string) {
        // No-op
    }

    getSubject() {
        return this.screenSubject;
    }

    getModalsInStack(): AvailableScreens[] {
        return this.state.screenStack.filter((s) => s === '(modals)');
    }

    reset() {
        this.stateSubject.next(initialState);
        this.screenSubject.next(undefined);
        this.tosOpen = false;
    }

    updateFromNavigationState(navState: ExpoNavigationState | undefined) {
        if (!navState) {
            return;
        }

        const screenStack: AvailableScreens[] = [];
        this.extractScreenIds(navState, screenStack);

        const stackChanged = screenStack.length !== this.state.screenStack.length ||
            screenStack.some((screen, index) => screen !== this.state.screenStack[index]);

        if (stackChanged) {
            const visibleScreen = screenStack[screenStack.length - 1];
            const prevVisibleScreen = this.state.screenStack[this.state.screenStack.length - 1];

            this.stateSubject.next({...this.state, screenStack});

            if (visibleScreen !== prevVisibleScreen) {
                this.screenSubject.next(visibleScreen);
            }
        }
    }

    waitUntilScreenHasLoaded(screenId: AvailableScreens): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this.isScreenInStack(screenId)) {
                resolve();
                return;
            }

            const subscription = this.state$.subscribe((state) => {
                if (state.screenStack.includes(screenId)) {
                    subscription.unsubscribe();
                    resolve();
                }
            });

            setTimeout(() => {
                subscription.unsubscribe();
                resolve();
            }, 3000);
        });
    }

    waitUntilScreenIsTop(screenId: AvailableScreens): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this.getVisibleScreen() === screenId) {
                resolve();
                return;
            }

            const subscription = this.state$.subscribe((state) => {
                const topScreen = state.screenStack[state.screenStack.length - 1];
                if (topScreen === screenId) {
                    subscription.unsubscribe();
                    resolve();
                }
            });

            setTimeout(() => {
                subscription.unsubscribe();
                resolve();
            }, 30000);
        });
    }

    waitUntilScreensIsRemoved(screenId: AvailableScreens): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.isScreenInStack(screenId)) {
                resolve();
                return;
            }

            const subscription = this.state$.subscribe((state) => {
                if (!state.screenStack.includes(screenId)) {
                    subscription.unsubscribe();
                    resolve();
                }
            });

            setTimeout(() => {
                subscription.unsubscribe();
                resolve();
            }, 3000);
        });
    }

    isToSOpen(): boolean {
        return this.tosOpen;
    }

    setToSOpen(open: boolean) {
        this.tosOpen = open;
    }

    private extractScreenIds(state: ExpoNavigationState, screenStack: AvailableScreens[]) {
        if (!state) {
            return;
        }

        const routes = state.routes || [];
        const currentIndex = state.index ?? 0;

        const isTabNavigator = state.type === 'tab';

        if (isTabNavigator) {
            const currentRoute = routes[currentIndex];
            if (currentRoute) {
                const currentScreenId = this.getScreenIdFromRouteKey(currentRoute.key);
                if (currentScreenId && !screenStack.includes(currentScreenId)) {
                    screenStack.push(currentScreenId);
                }

                if (currentRoute.state) {
                    this.extractScreenIds(currentRoute.state as ExpoNavigationState, screenStack);
                }
            }
        } else {
            routes.forEach((route: NavigationRoute<ParamListBase, string>) => {
                const screenId = this.getScreenIdFromRouteKey(route.key);
                if (screenId && !screenStack.includes(screenId)) {
                    screenStack.push(screenId);
                }

                if (route.state) {
                    this.extractScreenIds(route.state as ExpoNavigationState, screenStack);
                }
            });
        }
    }

    private getScreenIdFromRouteKey(routeKey: string): AvailableScreens | undefined {
        const fullPath = routeKey.split('-')[0];
        const segments = fullPath.split('/').filter(Boolean);

        if (segments.length === 0) {
            return undefined;
        }

        const lastSegment = segments[segments.length - 1];

        if (lastSegment === 'index' && segments.length > 1) {
            const parentSegment = segments[segments.length - 2];
            return parentSegment as AvailableScreens;
        }

        return lastSegment as AvailableScreens;
    }
}

export const NavigationStore = new NavigationStoreSingleton();

export function useCurrentScreen(): AvailableScreens | undefined {
    const [screen, setScreen] = useState<AvailableScreens | undefined>(() => NavigationStore.getVisibleScreen());

    useEffect(() => {
        const subscription = NavigationStore.currentScreen$.subscribe(setScreen);
        return () => subscription.unsubscribe();
    }, []);

    return screen;
}

export default NavigationStore;
