import React, { TouchEventHandler } from 'react';
import { ITrack } from '../../../base/tracks/types';
export interface IProps {
    /**
     * An object containing the CSS classes.
     */
    classes?: Partial<Record<'containerBackground' | 'indicatorsContainer' | 'indicatorsTopContainer' | 'tintBackground' | 'indicatorsBottomContainer' | 'indicatorsBackground', string>>;
    /**
     * The class name that will be used for the container.
     */
    containerClassName: string;
    /**
     * Indicates whether the thumbnail is hovered or not.
     */
    isHovered: boolean;
    /**
     * Indicates whether the thumbnail is for local screenshare or not.
     */
    isLocal: boolean;
    /**
     * Indicates whether we are currently running in a mobile browser.
     */
    isMobile: boolean;
    /**
     * Click handler.
     */
    onClick: (e?: React.MouseEvent) => void;
    /**
     * Mouse enter handler.
     */
    onMouseEnter: (e?: React.MouseEvent) => void;
    /**
     * Mouse leave handler.
     */
    onMouseLeave: (e?: React.MouseEvent) => void;
    /**
     * Mouse move handler.
     */
    onMouseMove: (e?: React.MouseEvent) => void;
    /**
     * Touch end handler.
     */
    onTouchEnd: TouchEventHandler;
    /**
     * Touch move handler.
     */
    onTouchMove: TouchEventHandler;
    /**
     * Touch start handler.
     */
    onTouchStart: TouchEventHandler;
    /**
     * The ID of the virtual screen share participant.
     */
    participantId: string;
    /**
     * Whether or not to display a tint background over tile.
     */
    shouldDisplayTintBackground: boolean;
    /**
     * An object with the styles for thumbnail.
     */
    styles: any;
    /**
     * The type of thumbnail.
     */
    thumbnailType: string;
    /**
     * JitsiTrack instance.
     */
    videoTrack: ITrack;
}
declare const VirtualScreenshareParticipant: ({ classes, containerClassName, isHovered, isLocal, isMobile, onClick, onMouseEnter, onMouseLeave, onMouseMove, onTouchEnd, onTouchMove, onTouchStart, participantId, shouldDisplayTintBackground, styles, videoTrack, thumbnailType }: IProps) => JSX.Element;
export default VirtualScreenshareParticipant;
