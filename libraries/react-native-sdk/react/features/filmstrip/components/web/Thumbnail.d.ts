import { Theme } from '@mui/material';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
import { IParticipant } from '../../../base/participants/types';
import { ITrack } from '../../../base/tracks/types';
/**
 * The type of the React {@code Component} state of {@link Thumbnail}.
 */
export interface IState {
    /**
     * Indicates that the canplay event has been received.
     */
    canPlayEventReceived: boolean;
    /**
     * The current display mode of the thumbnail.
     */
    displayMode: number;
    /**
     * Indicates whether the thumbnail is hovered or not.
     */
    isHovered: boolean;
    /**
     * Whether popover is visible or not.
     */
    popoverVisible: boolean;
}
/**
 * The type of the React {@code Component} props of {@link Thumbnail}.
 */
export interface IProps extends WithTranslation {
    /**
     * The audio track related to the participant.
     */
    _audioTrack?: ITrack;
    /**
     * Indicates whether the local video flip feature is disabled or not.
     */
    _disableLocalVideoFlip: boolean;
    /**
     * Indicates whether enlargement of tiles to fill the available space is disabled.
     */
    _disableTileEnlargement: boolean;
    /**
     * URL of GIF sent by this participant, null if there's none.
     */
    _gifSrc?: string;
    /**
     * The height of the Thumbnail.
     */
    _height: number;
    /**
     * Whether or not the participant is displayed on the stage filmstrip.
     * Used to hide the video from the vertical filmstrip.
     */
    _isActiveParticipant: boolean;
    /**
     * Indicates whether audio only mode is enabled.
     */
    _isAudioOnly: boolean;
    /**
     * Indicates whether the participant associated with the thumbnail is displayed on the large video.
     */
    _isCurrentlyOnLargeVideo: boolean;
    /**
     * Disable/enable the dominant speaker indicator.
     */
    _isDominantSpeakerDisabled: boolean;
    /**
     * Indicates whether the thumbnail should be hidden or not.
     */
    _isHidden: boolean;
    /**
     * Whether we are currently running in a mobile browser.
     */
    _isMobile: boolean;
    /**
     * Whether we are currently running in a mobile browser in portrait orientation.
     */
    _isMobilePortrait: boolean;
    /**
     * Indicates whether the participant is screen sharing.
     */
    _isScreenSharing: boolean;
    /**
     * Indicates whether the video associated with the thumbnail is playable.
     */
    _isVideoPlayable: boolean;
    /**
     * Indicates whether the participant is a virtual screen share participant. This prop is behind the
     * sourceNameSignaling feature flag.
     */
    _isVirtualScreenshareParticipant: boolean;
    /**
     * The current local video flip setting.
     */
    _localFlipX: boolean;
    /**
     * An object with information about the participant related to the thumbnail.
     */
    _participant: IParticipant;
    /**
     * Whether or not the participant has the hand raised.
     */
    _raisedHand: boolean;
    /**
     * Whether or not to display a tint background over tile.
     */
    _shouldDisplayTintBackground: boolean;
    /**
     * Whether or not the current layout is stage filmstrip layout.
     */
    _stageFilmstripLayout: boolean;
    /**
     * Whether or not the participants are displayed on stage.
     * (and not screensharing or shared video; used to determine
     * whether or not the display the participant video in the vertical filmstrip).
     */
    _stageParticipantsVisible: boolean;
    /**
     * The type of thumbnail to display.
     */
    _thumbnailType: string;
    /**
     * The video object position for the participant.
     */
    _videoObjectPosition: string;
    /**
     * The video track that will be displayed in the thumbnail.
     */
    _videoTrack?: any;
    /**
     * The width of the thumbnail.
     */
    _width: number;
    /**
     * An object containing CSS classes.
     */
    classes?: Partial<Record<keyof ReturnType<typeof defaultStyles>, string>>;
    /**
     * The redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The type of filmstrip the tile is displayed in.
     */
    filmstripType: string;
    /**
     * The horizontal offset in px for the thumbnail. Used to center the thumbnails from the last row in tile view.
     */
    horizontalOffset: number;
    /**
     * The ID of the participant related to the thumbnail.
     */
    participantID?: string;
    /**
     * Styles that will be set to the Thumbnail's main span element.
     */
    style?: any;
    /**
     * The width of the thumbnail. Used for expanding the width of the thumbnails on last row in case
     * there is empty space.
     */
    width?: number;
}
declare const defaultStyles: (theme: Theme) => {
    indicatorsContainer: {
        position: "absolute";
        padding: string;
        zIndex: number;
        width: string;
        boxSizing: "border-box";
        display: string;
        left: number;
        '&.tile-view-mode': {
            padding: string;
        };
    };
    indicatorsTopContainer: {
        top: number;
        justifyContent: string;
    };
    indicatorsBottomContainer: {
        bottom: number;
    };
    indicatorsBackground: {
        backgroundColor: string;
        borderRadius: string;
        display: string;
        alignItems: string;
        maxWidth: string;
        overflow: string;
        '&:not(:empty)': {
            padding: string;
        };
        '& > *:not(:last-child)': {
            marginRight: string;
        };
    };
    containerBackground: {
        position: "absolute";
        top: number;
        left: number;
        height: string;
        width: string;
        borderRadius: string;
        backgroundColor: string;
    };
    borderIndicator: {
        position: "absolute";
        width: string;
        height: string;
        zIndex: number;
        borderRadius: string;
        pointerEvents: "none";
    };
    borderIndicatorOnTop: {
        zIndex: number;
    };
    activeSpeaker: {
        '& .active-speaker-indicator': {
            boxShadow: string;
        };
    };
    raisedHand: {
        '& .raised-hand-border': {
            boxShadow: string;
        };
    };
    gif: {
        position: "absolute";
        width: string;
        height: string;
        display: string;
        justifyContent: string;
        alignItems: string;
        overflow: string;
        backgroundColor: string;
        '& img': {
            maxWidth: string;
            maxHeight: string;
            objectFit: "contain";
            flexGrow: number;
        };
    };
    tintBackground: {
        position: "absolute";
        zIndex: number;
        width: string;
        height: string;
        backgroundColor: string;
        opacity: number;
    };
    keyboardPinButton: {
        position: "absolute";
        zIndex: number;
        pointerEvents: "none";
        left: string;
        right: string;
        bottom: string;
        top: string;
    };
};
declare const _default: import("react-redux").ConnectedComponent<React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>, any>;
export default _default;
