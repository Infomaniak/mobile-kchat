import React from 'react';
import { WithTranslation } from 'react-i18next';
import AbstractDialog, { IProps as AbstractProps } from './AbstractDialog';
/**
 * The type of the React {@code Component} props of
 * {@link ConfirmDialog}.
 */
export interface IProps extends AbstractProps, WithTranslation {
    /**
     * The i18n key of the text label for the cancel button.
     */
    cancelLabel?: string;
    /**
     * The React {@code Component} children.
     */
    children?: React.ReactNode;
    /**
     * The i18n key of the text label for the confirm button.
     */
    confirmLabel?: string;
    /**
     * Dialog description key for translations.
     */
    descriptionKey?: string | {
        key: string;
        params: string;
    };
    /**
     * Whether or not the nature of the confirm button is destructive.
     */
    isConfirmDestructive?: Boolean;
    /**
     * Whether or not the confirm button is hidden.
     */
    isConfirmHidden?: Boolean;
    /**
     * Dialog title.
     */
    title?: string;
}
/**
 * React Component for getting confirmation to stop a file recording session in
 * progress.
 *
 * @augments Component
 */
declare class ConfirmDialog extends AbstractDialog<IProps> {
    /**
     * Default values for {@code ConfirmDialog} component's properties.
     *
     * @static
     */
    static defaultProps: {
        isConfirmDestructive: boolean;
        isConfirmHidden: boolean;
    };
    /**
     * Renders the dialog description.
     *
     * @returns {React$Component}
     */
    _renderDescription(): JSX.Element;
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<React.ClassAttributes<ConfirmDialog> & IProps, "dispatch" | "titleKey" | "descriptionKey" | "title" | "children" | "style" | "t" | "i18n" | "tReady" | "cancelDisabled" | "cancelKey" | "okDisabled" | "okKey" | "onCancel" | "onSubmit" | "titleString" | "cancelLabel" | "confirmLabel" | keyof React.ClassAttributes<ConfirmDialog>> & Partial<Pick<React.ClassAttributes<ConfirmDialog> & IProps, "isConfirmDestructive" | "isConfirmHidden">> & Partial<Pick<{
    isConfirmDestructive: boolean;
    isConfirmHidden: boolean;
}, never>>, "dispatch">, keyof WithTranslation>>;
export default _default;
