import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of
 * {@link MicrosoftSignInButton}.
 */
export interface IProps extends WithTranslation {
    /**
     * The callback to invoke when {@code MicrosoftSignInButton} is clicked.
     */
    onClick: (e?: React.MouseEvent) => void;
    /**
     * The text to display within {@code MicrosoftSignInButton}.
     */
    text: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
