import React from 'react';
import { WithTranslation } from 'react-i18next';
import { ColorValue, GestureResponderEvent } from 'react-native';
import { StyleType } from '../../../base/styles/functions.native';
interface IReactionStyles {
    /**
     * Style for text container. Used on raise hand button.
     */
    container?: StyleType;
    /**
     * Style for the emoji text on the button.
     */
    emoji: StyleType;
    /**
     * Style for the gif button.
     */
    gifButton: StyleType;
    /**
     * Style for the button.
     */
    style: StyleType;
    /**
     * Style for the label text on the button.
     */
    text?: StyleType;
    /**
     * Underlay color for the button.
     */
    underlayColor: ColorValue;
}
/**
 * The type of the React {@code Component} props of {@link ReactionButton}.
 */
export interface IProps extends WithTranslation {
    /**
     * Component children.
     */
    children?: React.ReactNode;
    /**
     * External click handler.
     */
    onClick?: (e?: GestureResponderEvent) => void;
    /**
     * The reaction to be sent.
     */
    reaction?: string;
    /**
     * Collection of styles for the button.
     */
    styles: IReactionStyles;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
