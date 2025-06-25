import { Theme } from '@mui/material';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
import AbstractDialogTab, { IProps as AbstractDialogTabProps } from '../../../base/dialog/components/web/AbstractDialogTab';
/**
 * The type of the React {@code Component} props of {@link ProfileTab}.
 */
export interface IProps extends AbstractDialogTabProps, WithTranslation {
    /**
     * Whether server-side authentication is available.
     */
    authEnabled: boolean;
    /**
     * The name of the currently (server-side) authenticated user.
     */
    authLogin: string;
    /**
     * CSS classes object.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * Invoked to change the configured calendar integration.
     */
    dispatch: IStore['dispatch'];
    /**
     * The display name to display for the local participant.
     */
    displayName: string;
    /**
     * The email to display for the local participant.
     */
    email: string;
    /**
     * Whether to hide the email input in the profile settings.
     */
    hideEmailInSettings?: boolean;
    /**
     * The id of the local participant.
     */
    id: string;
    /**
     * If the display name is read only.
     */
    readOnlyName: boolean;
}
declare const styles: (theme: Theme) => {
    container: {
        display: string;
        flexDirection: "column";
        width: string;
        padding: string;
    };
    avatarContainer: {
        display: string;
        width: string;
        justifyContent: string;
        marginBottom: string;
    };
    bottomMargin: {
        marginBottom: string;
    };
    label: any;
    name: {
        marginBottom: string;
    };
};
/**
 * React {@code Component} for modifying the local user's profile.
 *
 * @augments Component
 */
declare class ProfileTab extends AbstractDialogTab<IProps, any> {
    static defaultProps: {
        displayName: string;
        email: string;
    };
    /**
     * Initializes a new {@code ConnectedSettingsDialog} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code ConnectedSettingsDialog} instance with.
     */
    constructor(props: IProps);
    /**
     * Changes display name of the user.
     *
     * @param {string} value - The key event to handle.
     *
     * @returns {void}
     */
    _onDisplayNameChange(value: string): void;
    /**
     * Changes email of the user.
     *
     * @param {string} value - The key event to handle.
     *
     * @returns {void}
     */
    _onEmailChange(value: string): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Shows the dialog for logging in or out of a server and closes this
     * dialog.
     *
     * @private
     * @returns {void}
     */
    _onAuthToggle(): void;
    /**
     * Returns a React Element for interacting with server-side authentication.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderAuth(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<React.ClassAttributes<ProfileTab> & IProps, "hideEmailInSettings" | "readOnlyName" | "id" | "dispatch" | "t" | "i18n" | "tReady" | "classes" | "authEnabled" | "authLogin" | "onTabStateChange" | "tabId" | keyof React.ClassAttributes<ProfileTab>> & Partial<Pick<React.ClassAttributes<ProfileTab> & IProps, "email" | "displayName">> & Partial<Pick<{
    displayName: string;
    email: string;
}, never>>, "dispatch">, keyof WithTranslation>>;
export default _default;
