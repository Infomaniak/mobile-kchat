import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { StyleType } from '../../../base/styles/functions.native';
export interface IProps {
    /**
     * Icon button color.
     */
    color?: string;
    /**
     * Is the button disabled?
     */
    disabled?: boolean;
    /**
     * Label of the button.
     */
    label?: string;
    /**
     * Callback to invoke when the {@code HeaderNavigationButton} is clicked/pressed.
     */
    onPress?: (e?: GestureResponderEvent | React.MouseEvent) => void;
    /**
     * The ImageSource to be rendered as image.
     */
    src?: any;
    /**
     * Style of the button.
     */
    style?: StyleType;
    /**
     * Header has two actions.
     */
    twoActions?: boolean;
}
declare const HeaderNavigationButton: ({ color, disabled, label, onPress, src, style, twoActions }: IProps) => JSX.Element;
export default HeaderNavigationButton;
