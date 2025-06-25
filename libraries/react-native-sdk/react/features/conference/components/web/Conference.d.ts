import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
import type { AbstractProps } from '../AbstractConference';
/**
 * The type of the React {@code Component} props of {@link Conference}.
 */
export interface IProps extends AbstractProps, WithTranslation {
    /**
     * The alpha(opacity) of the background.
     */
    _backgroundAlpha?: number;
    /**
     * Are any overlays visible?
     */
    _isAnyOverlayVisible: boolean;
    /**
     * The CSS class to apply to the root of {@link Conference} to modify the
     * application layout.
     */
    _layoutClassName: string;
    /**
     * The config specified interval for triggering mouseMoved iframe api events.
     */
    _mouseMoveCallbackInterval?: number;
    /**
     *Whether or not the notifications should be displayed in the overflow drawer.
     */
    _overflowDrawer: boolean;
    /**
     * Name for this conference room.
     */
    _roomName: string;
    /**
     * If lobby page is visible or not.
     */
    _showLobby: boolean;
    /**
     * If prejoin page is visible or not.
     */
    _showPrejoin: boolean;
    dispatch: IStore['dispatch'];
}
declare const _default: import("react-redux").ConnectedComponent<React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>, import("react-redux").Omit<React.ClassAttributes<React.Component<import("react-i18next").Omit<IProps, keyof WithTranslation>, any, any>> & import("react-i18next").Omit<IProps, keyof WithTranslation>, "dispatch" | "_overflowDrawer" | "_backgroundAlpha" | "_roomName" | "_notificationsVisible" | "_room" | "_shouldDisplayTileView" | "_isAnyOverlayVisible" | "_layoutClassName" | "_mouseMoveCallbackInterval" | "_showLobby" | "_showPrejoin"> | import("react-redux").Omit<import("react-i18next").Omit<IProps, keyof WithTranslation> & {
    children?: React.ReactNode;
}, "dispatch" | "_overflowDrawer" | "_backgroundAlpha" | "_roomName" | "_notificationsVisible" | "_room" | "_shouldDisplayTileView" | "_isAnyOverlayVisible" | "_layoutClassName" | "_mouseMoveCallbackInterval" | "_showLobby" | "_showPrejoin">>;
export default _default;
