import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
import { IJitsiConference } from '../../../base/conference/reducer';
import { IConfig } from '../../../base/config/configType';
/**
 * The type of the React {@code Component} props of {@link LoginDialog}.
 */
export interface IProps extends WithTranslation {
    /**
     * {@link JitsiConference} That needs authentication - will hold a valid
     * value in XMPP login + guest access mode.
     */
    _conference?: IJitsiConference;
    /**
     * The server hosts specified in the global config.
     */
    _configHosts: IConfig['hosts'];
    /**
     * Indicates if the dialog should display "connecting" status message.
     */
    _connecting: boolean;
    /**
     * The error which occurred during login/authentication.
     */
    _error: any;
    /**
     * The progress in the floating range between 0 and 1 of the authenticating
     * and upgrading the role of the local participant/user.
     */
    _progress?: number;
    /**
     * Redux store dispatch method.
     */
    dispatch: IStore['dispatch'];
    /**
     * Conference room name.
     */
    roomName: string;
}
/**
 * The type of the React {@code Component} state of {@link LoginDialog}.
 */
export interface IState {
    /**
     * The user entered password for the conference.
     */
    password: string;
    /**
     * The user entered local participant name.
     */
    username: string;
}
/**
 * Component that renders the login in conference dialog.
 *
 *  @returns {React$Element<any>}
 */
declare class LoginDialog extends Component<IProps, IState> {
    /**
     * Initializes a new {@code LoginDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Called when the cancel button is clicked.
     *
     * @private
     * @returns {void}
     */
    _onCancelLogin(): void;
    /**
     * Notifies this LoginDialog that the login button (OK) has been pressed by
     * the user.
     *
     * @private
     * @returns {void}
     */
    _onLogin(): void;
    /**
     * Callback for the onChange event of the field.
     *
     * @param {string} value - The static event.
     * @returns {void}
     */
    _onPasswordChange(value: string): void;
    /**
     * Callback for the onChange event of the username input.
     *
     * @param {string} value - The new value.
     * @returns {void}
     */
    _onUsernameChange(value: string): void;
    /**
     * Renders an optional message, if applicable.
     *
     * @returns {ReactElement}
     * @private
     */
    renderMessage(): JSX.Element | null;
    /**
     * Implements {@Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<LoginDialog> & IProps, "dispatch" | "_conference" | "_configHosts" | "_connecting" | "_error" | "_progress">, keyof WithTranslation>>;
export default _default;
