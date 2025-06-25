import React from 'react';
import { WithTranslation } from 'react-i18next';
import { GestureResponderEvent } from 'react-native';
/**
 * The Google Brand image for Sign In.
 *
 * NOTE: iOS doesn't handle the react-native-google-signin button component
 * well due to our CocoaPods build process (the lib is not intended to be used
 * this way), hence the custom button implementation.
 */
export interface IProps extends WithTranslation {
    /**
     * The callback to invoke when the button is clicked.
     */
    onClick: (e?: React.MouseEvent<HTMLButtonElement> | GestureResponderEvent) => void;
    /**
     * True if the user is signed in, so it needs to render a different label
     * and maybe different style (for the future).
     */
    signedIn?: boolean;
    /**
     * The text to display within {@code GoogleSignInButton}.
     */
    text?: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
