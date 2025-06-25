import { Theme } from '@mui/material';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IProps as AbstractDialogTabProps } from '../../../base/dialog/components/web/AbstractDialogTab';
/**
 * The type of the React {@code Component} props of {@link MoreTab}.
 */
export interface IProps extends AbstractDialogTabProps, WithTranslation {
    /**
     * CSS classes object.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * The currently selected language to display in the language select
     * dropdown.
     */
    currentLanguage: string;
    /**
     * Whether to show hide self view setting.
     */
    disableHideSelfView: boolean;
    /**
     * Whether or not follow me is currently active (enabled by some other participant).
     */
    followMeActive: boolean;
    /**
     * Whether or not to hide self-view screen.
     */
    hideSelfView: boolean;
    /**
     * Whether we are in visitors mode.
     */
    iAmVisitor: boolean;
    /**
     * All available languages to display in the language select dropdown.
     */
    languages: Array<string>;
    /**
     * The number of max participants to display on stage.
     */
    maxStageParticipants: number;
    /**
     * Whether or not to display the language select dropdown.
     */
    showLanguageSettings: boolean;
    /**
     * Whether or not to display moderator-only settings.
     */
    showModeratorSettings: boolean;
    /**
     * Whether or not to show prejoin screen.
     */
    showPrejoinPage: boolean;
    /**
     * Whether or not to display the prejoin settings section.
     */
    showPrejoinSettings: boolean;
    /**
     * Wether or not the stage filmstrip is enabled.
     */
    stageFilmstripEnabled: boolean;
}
declare const styles: (theme: Theme) => {
    container: {
        display: string;
        flexDirection: "column";
        padding: string;
    };
    divider: {
        margin: string;
        width: string;
        height: string;
        border: number;
        backgroundColor: string;
    };
    checkbox: {
        margin: string;
    };
};
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
