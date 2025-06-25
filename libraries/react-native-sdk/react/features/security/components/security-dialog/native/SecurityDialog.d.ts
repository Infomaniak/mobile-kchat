import React from 'react';
import { IStore } from '../../../../app/types';
import { IJitsiConference } from '../../../../base/conference/reducer';
/**
 * The type of the React {@code Component} props of {@link SecurityDialog}.
 */
export interface IProps {
    /**
     * The JitsiConference which requires a password.
     */
    _conference?: IJitsiConference;
    /**
     * Whether enabling lobby is allowed or not.
     */
    _isEnablingLobbyAllowed: boolean;
    /**
     * Whether the local user is the moderator.
     */
    _isModerator: boolean;
    /**
     * Whether lobby mode is enabled or not.
     */
    _lobbyEnabled: boolean;
    /**
     * Whether the lobby mode switch is available or not.
     */
    _lobbyModeSwitchVisible: boolean;
    /**
     * The value for how the conference is locked (or undefined if not locked)
     * as defined by room-lock constants.
     */
    _locked?: string;
    /**
     * Checks if the conference room is locked or not.
     */
    _lockedConference: boolean;
    /**
     * The current known password for the JitsiConference.
     */
    _password?: string;
    /**
     * Number of digits used in the room-lock password.
     */
    _passwordNumberOfDigits?: number;
    /**
     * Whether setting a room password is available or not.
     */
    _roomPasswordControls: boolean;
    /**
     * Redux store dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Invoked to obtain translated strings.
     */
    t: Function;
}
/**
 * The type of the React {@code Component} state of {@link SecurityDialog}.
 */
export interface IState {
    /**
     * State of lobby mode.
     */
    lobbyEnabled: boolean;
    /**
     * Password added by the participant for room lock.
     */
    passwordInputValue: string;
    /**
     * Shows an input or a message.
     */
    showElement: boolean;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-i18next").WithTranslation, keyof import("react-i18next").WithTranslation>>;
export default _default;
