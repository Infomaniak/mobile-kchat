import React from 'react';
import { WithTranslation } from 'react-i18next';
import AbstractDialog, { IProps as AbstractProps, IState as AbstractState } from './AbstractDialog';
export interface IProps extends AbstractProps, WithTranslation {
    /**
     * The dialog descriptionKey.
     */
    descriptionKey?: string;
    /**
     * Whether to display the cancel button.
     */
    disableCancel?: boolean;
    /**
     * An optional initial value to initiate the field with.
     */
    initialValue?: string;
    /**
     * A message key to be shown for the user (e.g. An error that is defined after submitting the form).
     */
    messageKey?: string;
    /**
     * Props for the text input.
     */
    textInputProps?: Object;
    /**
     * The untranslated i18n key for the dialog title.
     */
    titleKey?: string;
    /**
     * Validating of the input.
     */
    validateInput?: Function;
}
export interface IState extends AbstractState {
    /**
     * The current value of the field.
     */
    fieldValue?: string;
    /**
     * The result of the input validation.
     */
    isValid: boolean;
}
/**
 * Implements a single field input dialog component.
 */
declare class InputDialog extends AbstractDialog<IProps, IState> {
    /**
     * Instantiates a new {@code InputDialog}.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Callback to be invoked when the text in the field changes.
     *
     * @param {string} fieldValue - The updated field value.
     * @returns {void}
     */
    _onChangeText(fieldValue: string): void;
    /**
     * Callback to be invoked when the value of this dialog is submitted.
     *
     * @returns {boolean}
     */
    _onSubmitValue(): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<InputDialog> & IProps, "dispatch">, keyof WithTranslation>>;
export default _default;
