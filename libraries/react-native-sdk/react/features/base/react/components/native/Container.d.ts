import React from 'react';
import { GestureResponderEvent } from 'react-native';
import AbstractContainer, { IProps as AbstractProps } from '../AbstractContainer';
export interface IProps extends AbstractProps {
    onClick?: (e: GestureResponderEvent) => void;
    /**
     * The event handler/listener to be invoked when this
     * {@code AbstractContainer} is long pressed on React Native.
     */
    onLongPress?: (e: GestureResponderEvent) => void;
    pointerEvents?: string;
}
/**
 * Represents a container of React Native/mobile {@link Component} children.
 *
 * @augments AbstractContainer
 */
export default class Container extends AbstractContainer<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
}
