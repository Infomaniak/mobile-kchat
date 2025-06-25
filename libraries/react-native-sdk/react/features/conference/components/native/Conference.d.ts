import React from 'react';
import { EdgeInsets } from 'react-native-safe-area-context';
import { IStore } from '../../../app/types';
import { StyleType } from '../../../base/styles/functions.any';
import type { AbstractProps } from '../AbstractConference';
/**
 * The type of the React {@code Component} props of {@link Conference}.
 */
export interface IProps extends AbstractProps {
    /**
     * Application's aspect ratio.
     */
    _aspectRatio: Symbol;
    /**
     * Whether the audio only is enabled or not.
     */
    _audioOnlyEnabled: boolean;
    /**
     * Branding styles for conference.
     */
    _brandingStyles: StyleType;
    /**
     * Whether the calendar feature is enabled or not.
     */
    _calendarEnabled: boolean;
    /**
     * The indicator which determines that we are still connecting to the
     * conference which includes establishing the XMPP connection and then
     * joining the room. If truthy, then an activity/loading indicator will be
     * rendered.
     */
    _connecting: boolean;
    /**
     * Set to {@code true} when the filmstrip is currently visible.
     */
    _filmstripVisible: boolean;
    /**
     * The indicator which determines whether fullscreen (immersive) mode is enabled.
     */
    _fullscreenEnabled: boolean;
    /**
     * The indicator which determines if the participants pane is open.
     */
    _isParticipantsPaneOpen: boolean;
    /**
     * The ID of the participant currently on stage (if any).
     */
    _largeVideoParticipantId: string;
    /**
     * Local participant's display name.
     */
    _localParticipantDisplayName: string;
    /**
     * Whether Picture-in-Picture is enabled.
     */
    _pictureInPictureEnabled: boolean;
    /**
     * The indicator which determines whether the UI is reduced (to accommodate
     * smaller display areas).
     */
    _reducedUI: boolean;
    /**
     * Indicates whether the lobby screen should be visible.
     */
    _showLobby: boolean;
    /**
     * Indicates whether the car mode is enabled.
     */
    _startCarMode: boolean;
    /**
     * The indicator which determines whether the Toolbox is visible.
     */
    _toolboxVisible: boolean;
    /**
     * The redux {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
    /**
    * Object containing the safe area insets.
    */
    insets: EdgeInsets;
    /**
     * Default prop for navigating between screen components(React Navigation).
     */
    navigation: any;
}
declare const _default: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<unknown>>;
export default _default;
