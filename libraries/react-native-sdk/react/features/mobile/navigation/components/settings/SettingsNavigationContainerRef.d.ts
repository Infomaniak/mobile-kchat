import { NavigationContainerRef } from '@react-navigation/native';
import React from 'react';
export declare const settingsNavigationContainerRef: React.RefObject<NavigationContainerRef<any>>;
/**
 * User defined navigation action included inside the reference to the container.
 *
 * @param {string} name - Destination name of the route that has been defined somewhere.
 * @param {Object} params - Params to pass to the destination route.
 * @returns {Function}
 */
export declare function navigate(name: string, params?: Object): void | undefined;
/**
 * User defined navigation action included inside the reference to the container.
 *
 * @returns {Function}
 */
export declare function goBack(): void | undefined;
