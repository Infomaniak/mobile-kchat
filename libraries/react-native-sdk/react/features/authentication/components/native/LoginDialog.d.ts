import React from 'react';
import { IStore } from '../../../app/types';
import { IJitsiConference } from '../../../base/conference/reducer';
/**
 * The type of the React {@link Component} props of {@link LoginDialog}.
 */
export interface IProps {
    /**
     * {@link JitsiConference} That needs authentication - will hold a valid
     * value in XMPP login + guest access mode.
     */
    _conference?: IJitsiConference;
    /**
     * The server hosts specified in the global config.
     */
    _configHosts?: {
        anonymousdomain?: string;
        authdomain?: string;
        domain: string;
        focus?: string;
        muc: string;
        visitorFocus?: string;
    };
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
     * Invoked to obtain translated strings.
     */
    t: Function;
}
/**
 * The type of the React {@link Component} state of {@link LoginDialog}.
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
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-i18next").WithTranslation, keyof import("react-i18next").WithTranslation>>;
export default _default;
