import { Theme } from '@mui/material';
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of {@link CalendarTab}.
 */
export interface IProps extends WithTranslation {
    /**
     * The name given to this Jitsi Application.
     */
    _appName: string;
    /**
     * Whether or not to display a button to sign in to Google.
     */
    _enableGoogleIntegration: boolean;
    /**
     * Whether or not to display a button to sign in to Microsoft.
     */
    _enableMicrosoftIntegration: boolean;
    /**
     * The current calendar integration in use, if any.
     */
    _isConnectedToCalendar: boolean;
    /**
     * The email address associated with the calendar integration in use.
     */
    _profileEmail?: string;
    /**
     * CSS classes object.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * Invoked to change the configured calendar integration.
     */
    dispatch: IStore['dispatch'];
}
/**
 * The type of the React {@code Component} state of {@link CalendarTab}.
 */
export interface IState {
    /**
     * Whether or not any third party APIs are being loaded.
     */
    loading: boolean;
}
declare const styles: (theme: Theme) => {
    container: any;
    button: {
        marginTop: string;
    };
};
/**
 * React {@code Component} for modifying calendar integration.
 *
 * @augments Component
 */
declare class CalendarTab extends Component<IProps, IState> {
    /**
     * Initializes a new {@code CalendarTab} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Loads third party APIs as needed and bootstraps the initial calendar
     * state if not already set.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Dispatches the action to start the sign in flow for a given calendar
     * integration type.
     *
     * @param {string} type - The calendar type to try integrating with.
     * @private
     * @returns {void}
     */
    _attemptSignIn(type: string): void;
    /**
     * Dispatches an action to sign out of the currently connected third party
     * used for calendar integration.
     *
     * @private
     * @returns {void}
     */
    _onClickDisconnect(): void;
    /**
     * Starts the sign in flow for Google calendar integration.
     *
     * @private
     * @returns {void}
     */
    _onClickGoogle(): void;
    /**
     * Starts the sign in flow for Microsoft calendar integration.
     *
     * @private
     * @returns {void}
     */
    _onClickMicrosoft(): void;
    /**
     * Render a React Element to indicate third party APIs are being loaded.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderLoadingState(): JSX.Element;
    /**
     * Render a React Element to sign into a third party for calendar
     * integration.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderSignInState(): JSX.Element;
    /**
     * Render a React Element to sign out of the currently connected third
     * party used for calendar integration.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderSignOutState(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<CalendarTab> & IProps, "dispatch" | "_appName" | "_enableGoogleIntegration" | "_enableMicrosoftIntegration" | "_isConnectedToCalendar" | "_profileEmail">, keyof WithTranslation>>;
export default _default;
