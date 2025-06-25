import React, { Component } from 'react';
import { IStore } from '../../app/types';
export interface IProps {
    /**
     * The alpha(opacity) of the background.
     */
    _backgroundAlpha?: number;
    /**
     * The user selected background color.
     */
    _customBackgroundColor: string;
    /**
     * The user selected background image url.
     */
    _customBackgroundImageUrl: string;
    /**
     * Whether the screen-sharing placeholder should be displayed or not.
     */
    _displayScreenSharingPlaceholder: boolean;
    /**
     * Whether or not the hideSelfView is enabled.
     */
    _hideSelfView: boolean;
    /**
     * Prop that indicates whether the chat is open.
     */
    _isChatOpen: boolean;
    /**
     * Whether or not the local screen share is on large-video.
     */
    _isScreenSharing: boolean;
    /**
     * The large video participant id.
     */
    _largeVideoParticipantId: string;
    /**
     * Local Participant id.
     */
    _localParticipantId: string;
    /**
     * Used to determine the value of the autoplay attribute of the underlying
     * video element.
     */
    _noAutoPlayVideo: boolean;
    /**
     * Whether or not the filmstrip is resizable.
     */
    _resizableFilmstrip: boolean;
    /**
     * Whether or not the screen sharing is visible.
     */
    _seeWhatIsBeingShared: boolean;
    /**
     * Whether or not to show dominant speaker badge.
     */
    _showDominantSpeakerBadge: boolean;
    /**
     * The width of the vertical filmstrip (user resized).
     */
    _verticalFilmstripWidth?: number | null;
    /**
     * The max width of the vertical filmstrip.
     */
    _verticalViewMaxWidth: number;
    /**
     * Whether or not the filmstrip is visible.
     */
    _visibleFilmstrip: boolean;
    /**
     * Whether or not the whiteboard is ready to be used.
     */
    _whiteboardEnabled: boolean;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
}
/** .
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * The conference participant who is on the local stage) on Web/React.
 *
 * @augments Component
 */
declare class LargeVideo extends Component<IProps> {
    _tappedTimeout: number | undefined;
    _containerRef: React.RefObject<HTMLDivElement>;
    _wrapperRef: React.RefObject<HTMLDivElement>;
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Element}
     */
    render(): JSX.Element;
    /**
     * Refreshes the video layout to determine the dimensions of the stage view.
     * If the filmstrip is toggled it adds CSS transition classes and removes them
     * when the transition is done.
     *
     * @returns {void}
     */
    _updateLayout(): void;
    /**
     * Clears the '_tappedTimout'.
     *
     * @private
     * @returns {void}
     */
    _clearTapTimeout(): void;
    /**
     * Creates the custom styles object.
     *
     * @private
     * @returns {Object}
     */
    _getCustomStyles(): any;
    /**
     * Sets view to tile view on double tap.
     *
     * @param {Object} e - The event.
     * @private
     * @returns {void}
     */
    _onDoubleTap(e: React.TouchEvent): void;
}
declare const _default: import("react-redux").ConnectedComponent<typeof LargeVideo, import("react-redux").Omit<React.ClassAttributes<LargeVideo> & IProps, "dispatch" | "_isScreenSharing" | "_noAutoPlayVideo" | "_localParticipantId" | "_resizableFilmstrip" | "_verticalFilmstripWidth" | "_verticalViewMaxWidth" | "_backgroundAlpha" | "_customBackgroundColor" | "_customBackgroundImageUrl" | "_displayScreenSharingPlaceholder" | "_hideSelfView" | "_isChatOpen" | "_largeVideoParticipantId" | "_seeWhatIsBeingShared" | "_showDominantSpeakerBadge" | "_visibleFilmstrip" | "_whiteboardEnabled">>;
export default _default;
