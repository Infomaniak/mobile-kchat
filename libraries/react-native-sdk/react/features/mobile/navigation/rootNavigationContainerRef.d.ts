import { NavigationContainerRef } from '@react-navigation/native';
import React from 'react';
import { IStore } from '../../app/types';
import { IStateful } from '../../base/app/types';
export declare const rootNavigationRef: React.RefObject<NavigationContainerRef<any>>;
/**
 * User defined navigation action included inside the reference to the container.
 *
 * @param {string} name - Destination name of the route that has been defined somewhere.
 * @param {Object} params - Params to pass to the destination route.
 * @returns {Function}
 */
export declare function navigateRoot(name: string, params?: Object): void | undefined;
/**
 * User defined navigation action included inside the reference to the container.
 *
 * @returns {Function}
 */
export declare function goBack(): void | undefined;
/**
 * Navigates back to Welcome page, if it's available.
 *
 * @param {Object|Function} stateful - Either the whole Redux state object or the Redux store's {@code getState} method.
 * @param {Function} dispatch - Redux dispatch function.
 * @returns {void}
 */
export declare function goBackToRoot(stateful: IStateful, dispatch: IStore['dispatch']): void;
