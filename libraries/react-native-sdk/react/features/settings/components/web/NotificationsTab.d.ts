import { Theme } from '@mui/material';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IProps as AbstractDialogTabProps } from '../../../base/dialog/components/web/AbstractDialogTab';
/**
 * The type of the React {@code Component} props of {@link NotificationsTab}.
 */
export interface IProps extends AbstractDialogTabProps, WithTranslation {
    /**
     * CSS classes object.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * Array of disabled sounds ids.
     */
    disabledSounds: string[];
    /**
     * Whether or not the reactions feature is enabled.
     */
    enableReactions: Boolean;
    /**
     * The types of enabled notifications that can be configured and their specific visibility.
     */
    enabledNotifications: Object;
    /**
     * Whether or not moderator muted the sounds.
     */
    moderatorMutedSoundsReactions: Boolean;
    /**
     * Whether or not to display notifications settings.
     */
    showNotificationsSettings: boolean;
    /**
     * Whether sound settings should be displayed or not.
     */
    showSoundsSettings: boolean;
    /**
     * Whether or not the sound for the incoming message should play.
     */
    soundsIncomingMessage: Boolean;
    /**
     * Whether or not the sound for the participant joined should play.
     */
    soundsParticipantJoined: Boolean;
    /**
     * Whether or not the sound for the participant entering the lobby should play.
     */
    soundsParticipantKnocking: Boolean;
    /**
     * Whether or not the sound for the participant left should play.
     */
    soundsParticipantLeft: Boolean;
    /**
    * Whether or not the sound for reactions should play.
    */
    soundsReactions: Boolean;
    /**
     * Whether or not the sound for the talk while muted notification should play.
     */
    soundsTalkWhileMuted: Boolean;
}
declare const styles: (theme: Theme) => {
    container: {
        display: string;
        width: string;
        '@media (max-width: 607px)': {
            flexDirection: "column";
        };
    };
    column: {
        display: string;
        flexDirection: "column";
        flex: number;
        '&:first-child:not(:last-child)': {
            marginRight: string;
            '@media (max-width: 607px)': {
                marginRight: number;
                marginBottom: string;
            };
        };
    };
    title: any;
    checkbox: {
        marginBottom: string;
    };
};
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
