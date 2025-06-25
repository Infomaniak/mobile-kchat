import React, { Component } from 'react';
import { IStore } from '../../app/types';
import { IJitsiConference } from '../../base/conference/reducer';
/**
 * {@code PasswordRequiredPrompt}'s React {@code Component} prop types.
 */
export interface IProps {
    /**
     * The previously entered password, if any.
     */
    _password?: string;
    /**
     * Number of digits used in the room-lock password.
     */
    _passwordNumberOfDigits?: number;
    /**
     * The {@code JitsiConference} which requires a password.
     *
     * @type {JitsiConference}
     */
    conference: IJitsiConference;
    /**
     * The redux dispatch function.
     */
    dispatch: IStore['dispatch'];
}
export interface IState {
    /**
     * The previously entered password, if any.
     */
    password?: string;
}
/**
 * Implements a React {@code Component} which prompts the user when a password
 * is required to join a conference.
 */
declare class PasswordRequiredPrompt extends Component<IProps, IState> {
    /**
     * Initializes a new {@code PasswordRequiredPrompt} instance.
     *
     * @param {IProps} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Notifies this prompt that it has been dismissed by cancel.
     *
     * @private
     * @returns {boolean} If this prompt is to be closed/hidden, {@code true};
     * otherwise, {@code false}.
     */
    _onCancel(): boolean;
    /**
     * Notifies this prompt that it has been dismissed by submitting a specific
     * value.
     *
     * @param {string|undefined} value - The submitted value.
     * @private
     * @returns {boolean} If this prompt is to be closed/hidden, {@code true};
     * otherwise, {@code false}.
     */
    _onSubmit(value?: string): boolean;
}
declare const _default: import("react-redux").ConnectedComponent<typeof PasswordRequiredPrompt, import("react-redux").Omit<React.ClassAttributes<PasswordRequiredPrompt> & IProps, "dispatch" | "_password" | "_passwordNumberOfDigits">>;
export default _default;
