import { Theme } from '@mui/material';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IProps as AbstractDialogTabProps } from '../../../base/dialog/components/web/AbstractDialogTab';
/**
 * The type of the React {@code Component} props of {@link ModeratorTab}.
 */
export interface IProps extends AbstractDialogTabProps, WithTranslation {
    /**
     * CSS classes object.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * If set hides the reactions moderation setting.
     */
    disableReactionsModeration: boolean;
    /**
     * Whether or not follow me is currently active (enabled by some other participant).
     */
    followMeActive: boolean;
    /**
     * Whether or not the user has selected the Follow Me feature to be enabled.
     */
    followMeEnabled: boolean;
    /**
     * Whether or not the user has selected the Start Audio Muted feature to be
     * enabled.
     */
    startAudioMuted: boolean;
    /**
     * Whether or not the user has selected the Start Reactions Muted feature to be
     * enabled.
     */
    startReactionsMuted: boolean;
    /**
     * Whether or not the user has selected the Start Video Muted feature to be
     * enabled.
     */
    startVideoMuted: boolean;
}
declare const styles: (theme: Theme) => {
    container: {
        display: string;
        flexDirection: "column";
    };
    title: any;
    checkbox: {
        marginBottom: string;
    };
};
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
