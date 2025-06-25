import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
import { NOTIFY_CLICK_MODE, ToolbarButton } from '../../types';
/**
 * The type of the React {@code Component} props of {@link Toolbox}.
 */
export interface IProps extends WithTranslation {
    /**
     * Toolbar buttons which have their click exposed through the API.
     */
    _buttonsWithNotifyClick: Map<string, NOTIFY_CLICK_MODE>;
    /**
     * Whether or not the chat feature is currently displayed.
     */
    _chatOpen: boolean;
    /**
     * The width of the client.
     */
    _clientWidth: number;
    /**
     * Custom Toolbar buttons.
     */
    _customToolbarButtons?: Array<{
        backgroundColor?: string;
        icon: string;
        id: string;
        text: string;
    }>;
    /**
     * Whether or not a dialog is displayed.
     */
    _dialog: boolean;
    /**
     * Whether or not the toolbox is disabled. It is for recorders.
     */
    _disabled: boolean;
    /**
     * Whether the end conference feature is supported.
     */
    _endConferenceSupported: boolean;
    /**
     * Whether the hangup menu is visible.
     */
    _hangupMenuVisible: boolean;
    /**
     * Whether or not the app is running in mobile browser.
     */
    _isMobile: boolean;
    /**
     * Whether we are in narrow layout mode.
     */
    _isNarrowLayout: boolean;
    /**
     * The array of toolbar buttons disabled through jwt features.
     */
    _jwtDisabledButtons: string[];
    /**
     * The main toolbar buttons thresholds used to determine the visible buttons depending on the current screen size.
     */
    _mainToolbarButtonsThresholds: Array<{
        order: Array<ToolbarButton | string>;
        width: number;
    }>;
    /**
     * Whether or not the overflow menu is displayed in a drawer drawer.
     */
    _overflowDrawer: boolean;
    /**
     * Whether or not the overflow menu is visible.
     */
    _overflowMenuVisible: boolean;
    /**
     * Whether or not to display reactions in separate button.
     */
    _reactionsButtonEnabled: boolean;
    /**
     * Whether the toolbox should be shifted up or not.
     */
    _shiftUp: boolean;
    /**
     * Whether any reactions buttons should be displayed or not.
     */
    _shouldDisplayReactionsButtons: boolean;
    /**
     * The enabled buttons.
     */
    _toolbarButtons: Array<string>;
    /**
     * Flag showing whether toolbar is visible.
     */
    _visible: boolean;
    /**
     * Invoked to active other features of the app.
     */
    dispatch: IStore['dispatch'];
    /**
     * Explicitly passed array with the buttons which this Toolbox should display.
     */
    toolbarButtons: Array<string>;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof WithTranslation>>;
export default _default;
