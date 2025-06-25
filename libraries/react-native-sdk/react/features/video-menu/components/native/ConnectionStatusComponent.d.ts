import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
export interface IProps extends WithTranslation {
    /**
     * Whether this participant's connection is inactive.
     */
    _isConnectionStatusInactive: boolean;
    /**
     * Whether this participant's connection is interrupted.
     */
    _isConnectionStatusInterrupted: boolean;
    /**
     * True if the menu is currently open, false otherwise.
     */
    _isOpen: boolean;
    /**
     * Display name of the participant retrieved from Redux.
     */
    _participantDisplayName: string;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The ID of the participant that this button is supposed to pin.
     */
    participantID: string;
    /**
     * Theme used for styles.
     */
    theme: any;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<(import("react-redux").Omit<React.ClassAttributes<React.Component<Pick<IProps, "dispatch" | "t" | "i18n" | "tReady" | "participantID" | "_isConnectionStatusInactive" | "_isConnectionStatusInterrupted" | "_isOpen" | "_participantDisplayName"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<unknown> | undefined;
}, any, any>> & Pick<IProps, "dispatch" | "t" | "i18n" | "tReady" | "participantID" | "_isConnectionStatusInactive" | "_isConnectionStatusInterrupted" | "_isOpen" | "_participantDisplayName"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<unknown> | undefined;
}, "dispatch" | "_isConnectionStatusInactive" | "_isConnectionStatusInterrupted" | "_participantDisplayName"> | import("react-redux").Omit<Pick<IProps, "dispatch" | "t" | "i18n" | "tReady" | "participantID" | "_isConnectionStatusInactive" | "_isConnectionStatusInterrupted" | "_isOpen" | "_participantDisplayName"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<unknown> | undefined;
} & {
    children?: React.ReactNode;
}, "dispatch" | "_isConnectionStatusInactive" | "_isConnectionStatusInterrupted" | "_participantDisplayName">) & IProps, keyof WithTranslation>>;
export default _default;
