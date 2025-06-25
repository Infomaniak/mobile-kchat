import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../../app/types';
/**
 * Prop type of the component {@code GoogleSigninForm}.
 */
export interface IProps extends WithTranslation {
    /**
     * Style of the dialogs feature.
     */
    _dialogStyles: any;
    /**
     * The Redux dispatch Function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The current state of the Google api as defined in {@code constants.js}.
     */
    googleAPIState: number;
    /**
     * The recently received Google response.
     */
    googleResponse: any;
    /**
     * A callback to be invoked when an authenticated user changes, so
     * then we can get (or clear) the YouTube stream key.
     */
    onUserChanged: Function;
}
/**
 * Class to render a google sign in form, or a google stream picker dialog.
 *
 * @augments Component
 */
declare class GoogleSigninForm extends Component<IProps> {
    /**
     * Instantiates a new {@code GoogleSigninForm} component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's Component.componentDidMount.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Renders the component.
     *
     * @inheritdoc
     */
    render(): JSX.Element | null;
    /**
     * A helper function to log developer related errors.
     *
     * @private
     * @param {Object} error - The error to be logged.
     * @returns {void}
     */
    _logGoogleError(error: Error): void;
    /**
     * Callback to be invoked when the user presses the Google button,
     * regardless of being logged in or out.
     *
     * @private
     * @returns {void}
     */
    _onGoogleButtonPress(): void;
    /**
     * Initiates a sign in if the user is not signed in yet.
     *
     * @private
     * @returns {void}
     */
    _onSignIn(): void;
    /**
     * Initiates a sign out if the user is signed in.
     *
     * @private
     * @returns {void}
     */
    _onSignOut(): void;
    /**
     * Updates the API (Google Auth) state.
     *
     * @private
     * @param {number} apiState - The state of the API.
     * @param {?Object} googleResponse - The response from the API.
     * @returns {void}
     */
    _setApiState(apiState: number, googleResponse?: Object): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<GoogleSigninForm> & IProps, "dispatch" | "_dialogStyles" | "googleAPIState" | "googleResponse">, keyof WithTranslation>>;
export default _default;
