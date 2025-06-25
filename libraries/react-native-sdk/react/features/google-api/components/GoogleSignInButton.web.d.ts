import React from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * The callback to invoke when the button is clicked.
     */
    onClick: (e?: React.MouseEvent) => void;
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
