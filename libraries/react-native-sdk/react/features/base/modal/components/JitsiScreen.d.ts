import React from 'react';
import { Edge } from 'react-native-safe-area-context';
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
     * Disabled forced keyboard dismiss?
     */
    disableForcedKeyboardDismiss?: boolean;
    /**
     * Optional function that renders a footer component, if needed.
     */
    footerComponent?: Function;
    /**
     * Is a text input rendered at the bottom of the screen?
     */
    hasBottomTextInput?: boolean;
    /**
     * Is the screen header having an extra height?
     */
    hasExtraHeaderHeight?: boolean;
    /**
     * Insets for the SafeAreaView.
     */
    safeAreaInsets?: Edge[];
    /**
     * Additional style to be appended to the KeyboardAvoidingView containing the content of the modal.
     */
    style?: StyleType;
}
declare const JitsiScreen: ({ addBottomPadding, contentContainerStyle, children, disableForcedKeyboardDismiss, footerComponent, hasBottomTextInput, hasExtraHeaderHeight, safeAreaInsets, style }: IProps) => JSX.Element;
export default JitsiScreen;
