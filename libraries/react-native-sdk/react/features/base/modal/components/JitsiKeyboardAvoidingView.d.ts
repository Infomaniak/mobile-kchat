import React from 'react';
import { StyleType } from '../../styles/functions.any';
export interface IProps {
    /**
     * Adds bottom padding.
     */
    addBottomPadding?: boolean;
    /**
     * The children component(s) of the Modal, to be rendered.
     */
    children: React.ReactNode;
    /**
     * Additional style to be appended to the KeyboardAvoidingView content container.
     */
    contentContainerStyle?: StyleType;
    /**
     * Disable forced keyboard dismiss?
     */
    disableForcedKeyboardDismiss?: boolean;
    /**
     * Is a text input rendered at the bottom of the screen?
     */
    hasBottomTextInput: boolean;
    /**
     * Is the screen header having an extra height?
     */
    hasExtraHeaderHeight?: boolean;
    /**
     * Additional style to be appended to the KeyboardAvoidingView.
     */
    style?: StyleType;
}
declare const JitsiKeyboardAvoidingView: ({ addBottomPadding, children, contentContainerStyle, disableForcedKeyboardDismiss, hasBottomTextInput, hasExtraHeaderHeight, style }: IProps) => JSX.Element;
export default JitsiKeyboardAvoidingView;
