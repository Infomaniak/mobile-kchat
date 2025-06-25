import React, { Component } from 'react';
import { GestureResponderEvent } from 'react-native';
/**
 * The type of the React {@link Component} props of {@link Pressable}.
 */
export interface IProps {
    children: React.ReactNode;
    /**
     * Called when the touch is released, but not if cancelled (e.g. By a scroll
     * that steals the responder lock).
     */
    onPress?: (event: GestureResponderEvent) => void;
}
/**
 * Adds support for {@code onPress} to a child React {@link Component} (which
 * should probably not support the prop in question; otherwise, there's little
 * point of using {@code Pressable} then in the first place).
 */
export default class Pressable extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Node}
     */
    render(): React.ReactNode;
}
