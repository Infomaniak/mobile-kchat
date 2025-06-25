import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { IStateful } from '../../base/app/types';
/**
 * Close icon/text button based on platform.
 *
 * @param {Function} goBack - Goes back to the previous screen function.
 * @returns {React.Component}
 */
export declare function screenHeaderCloseButton(goBack: (e?: GestureResponderEvent | React.MouseEvent) => void): JSX.Element;
/**
 * Determines whether the {@code Prejoin page} is enabled by the app itself
 * (e.g. Programmatically via the Jitsi Meet SDK for Android and iOS).
 *
 * @param {Function|Object} stateful - The redux state or {@link getState}
 * function.
 * @returns {boolean} If the {@code Prejoin} is enabled by the app, then
 * {@code true}; otherwise, {@code false}.
 */
export declare function isPrejoinPageEnabled(stateful: IStateful): any;
/**
 * Close icon/text button for lobby screen based on platform.
 *
 * @returns {React.Component}
 */
export declare function lobbyScreenHeaderCloseButton(): JSX.Element;
/**
 * Returns true if we should auto-knock in case prejoin is enabled for the room.
 *
 * @param {Function|Object} stateful - The redux state or {@link getState}
 * function.
 * @returns {boolean}
 */
export declare function shouldEnableAutoKnock(stateful: IStateful): boolean | undefined;
