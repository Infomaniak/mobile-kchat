import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
import { IJitsiConference } from '../../base/conference/reducer';
/**
 * The type of the React {@code Component} props of
 * {@link PasswordRequiredPrompt}.
 */
export interface IProps extends WithTranslation {
    /**
     * The JitsiConference which requires a password.
     */
    conference: IJitsiConference;
    /**
     * The redux store's {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
}
/**
 * The type of the React {@code Component} state of
 * {@link PasswordRequiredPrompt}.
 */
export interface IState {
    /**
     * The password entered by the local participant.
     */
    password?: string;
}
/**
 * Implements a React Component which prompts the user when a password is
 * required to join a conference.
 */
declare class PasswordRequiredPrompt extends Component<IProps, IState> {
    state: {
        password: string;
    };
    /**
     * Initializes a new PasswordRequiredPrompt instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Display component in dialog body.
     *
     * @returns {ReactElement}
     * @protected
     */
    _renderBody(): JSX.Element;
    /**
     * Notifies this dialog that password has changed.
     *
     * @param {string} value - The details of the notification/event.
     * @private
     * @returns {void}
     */
    _onPasswordChanged(value: string): void;
    /**
     * Dispatches action to cancel and dismiss this dialog.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel(): boolean;
    /**
     * Dispatches action to submit value from this dialog.
     *
     * @private
     * @returns {boolean}
     */
    _onSubmit(): boolean;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<PasswordRequiredPrompt> & IProps, "dispatch">, keyof WithTranslation>>;
export default _default;
