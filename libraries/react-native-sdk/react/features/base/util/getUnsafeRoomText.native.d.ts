import React from 'react';
import { Text } from 'react-native';
import { IReduxState } from '../../app/types';
/**
 * Gets the unsafe room text for the given context.
 *
 * @param {IReduxState} state - The redux state.
 * @param {Function} t - The translation function.
 * @param {'meeting'|'prejoin'|'welcome'} context - The given context of the warining.
 * @returns {Text}
 */
export default function getUnsafeRoomText(state: IReduxState, t: Function, context: 'meeting' | 'prejoin' | 'welcome'): React.CElement<import("react-native").TextProps, Text>;
