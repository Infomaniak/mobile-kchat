"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clsx_1 = __importDefault(require("clsx"));
const debounce_1 = __importDefault(require("lodash/debounce"));
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const utils_1 = require("../../../base/environment/utils");
const functions_2 = require("../../../base/i18n/functions");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const VideoTrack_1 = __importDefault(require("../../../base/media/components/web/VideoTrack"));
const constants_1 = require("../../../base/media/constants");
const actions_1 = require("../../../base/participants/actions");
const functions_3 = require("../../../base/participants/functions");
const constants_2 = require("../../../base/responsive-ui/constants");
const Tooltip_1 = __importDefault(require("../../../base/tooltip/components/Tooltip"));
const actions_2 = require("../../../base/tracks/actions");
const functions_4 = require("../../../base/tracks/functions");
const functions_5 = require("../../../face-landmarks/functions");
const actions_3 = require("../../../gifs/actions");
const functions_6 = require("../../../gifs/functions");
const PresenceLabel_1 = __importDefault(require("../../../presence-status/components/PresenceLabel"));
const constants_3 = require("../../../video-layout/constants");
const functions_web_1 = require("../../../video-layout/functions.web");
const actions_4 = require("../../actions");
const constants_4 = require("../../constants");
const functions_7 = require("../../functions");
const ThumbnailAudioIndicator_1 = __importDefault(require("./ThumbnailAudioIndicator"));
const ThumbnailBottomIndicators_1 = __importDefault(require("./ThumbnailBottomIndicators"));
const ThumbnailTopIndicators_1 = __importDefault(require("./ThumbnailTopIndicators"));
const VirtualScreenshareParticipant_1 = __importDefault(require("./VirtualScreenshareParticipant"));
const defaultStyles = (theme) => {
    return {
        indicatorsContainer: {
            position: 'absolute',
            padding: theme.spacing(1),
            zIndex: 10,
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            left: 0,
            '&.tile-view-mode': {
                padding: theme.spacing(2)
            }
        },
        indicatorsTopContainer: {
            top: 0,
            justifyContent: 'space-between'
        },
        indicatorsBottomContainer: {
            bottom: 0
        },
        indicatorsBackground: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            maxWidth: '100%',
            overflow: 'hidden',
            '&:not(:empty)': {
                padding: '4px 8px'
            },
            '& > *:not(:last-child)': {
                marginRight: '8px'
            }
        },
        containerBackground: {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            borderRadius: '4px',
            backgroundColor: theme.palette.ui02
        },
        borderIndicator: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 9,
            borderRadius: '4px',
            pointerEvents: 'none'
        },
        borderIndicatorOnTop: {
            zIndex: 11
        },
        activeSpeaker: {
            '& .active-speaker-indicator': {
                boxShadow: `inset 0px 0px 0px 3px ${theme.palette.action01Hover} !important`
            }
        },
        raisedHand: {
            '& .raised-hand-border': {
                boxShadow: `inset 0px 0px 0px 2px ${theme.palette.warning02} !important`
            }
        },
        gif: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: theme.palette.ui02,
            '& img': {
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                flexGrow: 1
            }
        },
        tintBackground: {
            position: 'absolute',
            zIndex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: `${theme.palette.uiBackground}`,
            opacity: 0.8
        },
        keyboardPinButton: {
            position: 'absolute',
            zIndex: 10,
            /* this button is only for keyboard/screen reader users,
            an onClick handler is already set elsewhere for mouse users, so make sure
            we can't click on it */
            pointerEvents: 'none',
            // make room for the border to correctly show up
            left: '3px',
            right: '3px',
            bottom: '3px',
            top: '3px'
        }
    };
};
/**
 * Implements a thumbnail.
 *
 * @augments Component
 */
class Thumbnail extends react_1.Component {
    /**
     * Initializes a new Thumbnail instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
     */
    constructor(props) {
        super(props);
        const state = {
            canPlayEventReceived: false,
            displayMode: constants_4.DISPLAY_VIDEO,
            popoverVisible: false,
            isHovered: false
        };
        this.state = {
            ...state,
            displayMode: (0, functions_7.computeDisplayModeFromInput)((0, functions_7.getDisplayModeInput)(props, state))
        };
        this.timeoutHandle = undefined;
        this.containerRef = (0, react_1.createRef)();
        this._clearDoubleClickTimeout = this._clearDoubleClickTimeout.bind(this);
        this._onCanPlay = this._onCanPlay.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onTogglePinButtonKeyDown = this._onTogglePinButtonKeyDown.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseMove = (0, debounce_1.default)(this._onMouseMove.bind(this), 100, {
            leading: true,
            trailing: false
        });
        this._onMouseLeave = this._onMouseLeave.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._showPopover = this._showPopover.bind(this);
        this._hidePopover = this._hidePopover.bind(this);
        this._onGifMouseEnter = this._onGifMouseEnter.bind(this);
        this._onGifMouseLeave = this._onGifMouseLeave.bind(this);
        this.handleTrackStreamingStatusChanged = this.handleTrackStreamingStatusChanged.bind(this);
    }
    /**
     * Starts listening for track streaming status updates after the initial render.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        this._onDisplayModeChanged();
        // Listen to track streaming status changed event to keep it updated.
        // TODO: after converting this component to a react function component,
        // use a custom hook to update local track streaming status.
        const { _videoTrack, dispatch } = this.props;
        if (_videoTrack && !_videoTrack.local) {
            _videoTrack.jitsiTrack.on(lib_jitsi_meet_1.JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED, this.handleTrackStreamingStatusChanged);
            dispatch((0, actions_2.trackStreamingStatusChanged)(_videoTrack.jitsiTrack, _videoTrack.jitsiTrack.getTrackStreamingStatus()));
        }
    }
    /**
     * Remove listeners for track streaming status update.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        // TODO: after converting this component to a react function component,
        // use a custom hook to update local track streaming status.
        const { _videoTrack, dispatch } = this.props;
        if (_videoTrack && !_videoTrack.local) {
            _videoTrack.jitsiTrack.off(lib_jitsi_meet_1.JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED, this.handleTrackStreamingStatusChanged);
            dispatch((0, actions_2.trackStreamingStatusChanged)(_videoTrack.jitsiTrack, _videoTrack.jitsiTrack.getTrackStreamingStatus()));
        }
    }
    /**
     * Stops listening for track streaming status updates on the old track and starts
     * listening instead on the new track.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevState.displayMode !== this.state.displayMode) {
            this._onDisplayModeChanged();
        }
        // TODO: after converting this component to a react function component,
        // use a custom hook to update local track streaming status.
        const { _videoTrack, dispatch } = this.props;
        if (prevProps._videoTrack?.jitsiTrack?.getSourceName() !== _videoTrack?.jitsiTrack?.getSourceName()) {
            if (prevProps._videoTrack && !prevProps._videoTrack.local) {
                prevProps._videoTrack.jitsiTrack.off(lib_jitsi_meet_1.JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED, this.handleTrackStreamingStatusChanged);
                dispatch((0, actions_2.trackStreamingStatusChanged)(prevProps._videoTrack.jitsiTrack, prevProps._videoTrack.jitsiTrack.getTrackStreamingStatus()));
            }
            if (_videoTrack && !_videoTrack.local) {
                _videoTrack.jitsiTrack.on(lib_jitsi_meet_1.JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED, this.handleTrackStreamingStatusChanged);
                dispatch((0, actions_2.trackStreamingStatusChanged)(_videoTrack.jitsiTrack, _videoTrack.jitsiTrack.getTrackStreamingStatus()));
            }
        }
    }
    /**
     * Handle track streaming status change event by
     * by dispatching an action to update track streaming status for the given track in app state.
     *
     * @param {JitsiTrack} jitsiTrack - The track with streaming status updated.
     * @param {JitsiTrackStreamingStatus} streamingStatus - The updated track streaming status.
     * @returns {void}
     */
    handleTrackStreamingStatusChanged(jitsiTrack, streamingStatus) {
        this.props.dispatch((0, actions_2.trackStreamingStatusChanged)(jitsiTrack, streamingStatus));
    }
    /**
     * Handles display mode changes.
     *
     * @returns {void}
     */
    _onDisplayModeChanged() {
        const input = (0, functions_7.getDisplayModeInput)(this.props, this.state);
        this._maybeSendScreenSharingIssueEvents(input);
    }
    /**
     * Sends screen sharing issue event if an issue is detected.
     *
     * @param {Object} input - The input used to compute the thumbnail display mode.
     * @returns {void}
     */
    _maybeSendScreenSharingIssueEvents(input) {
        const { _isAudioOnly, _isScreenSharing, _thumbnailType } = this.props;
        const { displayMode } = this.state;
        const isTileType = _thumbnailType === constants_4.THUMBNAIL_TYPE.TILE;
        if (!(constants_4.DISPLAY_VIDEO === displayMode)
            && isTileType
            && _isScreenSharing
            && !_isAudioOnly) {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createScreenSharingIssueEvent)({
                source: 'thumbnail',
                ...input
            }));
        }
    }
    /**
     * Implements React's {@link Component#getDerivedStateFromProps()}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props, prevState) {
        if (!props._videoTrack && prevState.canPlayEventReceived) {
            const newState = {
                ...prevState,
                canPlayEventReceived: false
            };
            return {
                ...newState,
                displayMode: (0, functions_7.computeDisplayModeFromInput)((0, functions_7.getDisplayModeInput)(props, newState))
            };
        }
        const newDisplayMode = (0, functions_7.computeDisplayModeFromInput)((0, functions_7.getDisplayModeInput)(props, prevState));
        if (newDisplayMode !== prevState.displayMode) {
            return {
                ...prevState,
                displayMode: newDisplayMode
            };
        }
        return null;
    }
    /**
     * Clears the first click timeout.
     *
     * @returns {void}
     */
    _clearDoubleClickTimeout() {
        clearTimeout(this._firstTap);
        this._firstTap = undefined;
    }
    /**
     * Shows popover.
     *
     * @private
     * @returns {void}
     */
    _showPopover() {
        this.setState({
            popoverVisible: true
        });
    }
    /**
     * Hides popover.
     *
     * @private
     * @returns {void}
     */
    _hidePopover() {
        const { _thumbnailType } = this.props;
        if (_thumbnailType === constants_4.THUMBNAIL_TYPE.VERTICAL) {
            this.setState({
                isHovered: false
            });
        }
        this.setState({
            popoverVisible: false
        });
    }
    /**
     * Returns the size the avatar should have.
     *
     * @returns {number}
     */
    _getAvatarSize() {
        const { _height, _width } = this.props;
        return Math.min(_height / 2, _width - 30, 200);
    }
    /**
     * Returns an object with the styles for thumbnail.
     *
     * @returns {Object} - The styles for the thumbnail.
     */
    _getStyles() {
        const { canPlayEventReceived } = this.state;
        const { _disableTileEnlargement, _height, _isVirtualScreenshareParticipant, _isHidden, _isScreenSharing, _participant, _thumbnailType, _videoObjectPosition, _videoTrack, _width, horizontalOffset, style } = this.props;
        const isTileType = _thumbnailType === constants_4.THUMBNAIL_TYPE.TILE;
        const jitsiVideoTrack = _videoTrack?.jitsiTrack;
        const track = jitsiVideoTrack?.track;
        const isPortraitVideo = (track?.getSettings()?.aspectRatio || 1) < 1;
        let styles = {
            thumbnail: {},
            avatar: {},
            video: {}
        };
        const avatarSize = this._getAvatarSize();
        let { left } = style || {};
        if (typeof left === 'number' && horizontalOffset) {
            left += horizontalOffset;
        }
        let videoStyles = null;
        const doNotStretchVideo = (isPortraitVideo && isTileType)
            || _disableTileEnlargement
            || _isScreenSharing;
        if (canPlayEventReceived || _participant.local || _isVirtualScreenshareParticipant) {
            videoStyles = {
                objectFit: doNotStretchVideo ? 'contain' : 'cover'
            };
        }
        else {
            videoStyles = {
                display: 'none'
            };
        }
        if (videoStyles.objectFit === 'cover') {
            videoStyles.objectPosition = _videoObjectPosition;
        }
        styles = {
            thumbnail: {
                ...style,
                left,
                height: `${_height}px`,
                minHeight: `${_height}px`,
                minWidth: `${_width}px`,
                width: `${_width}px`
            },
            avatar: {
                height: `${avatarSize}px`,
                width: `${avatarSize}px`
            },
            video: videoStyles
        };
        if (_isHidden) {
            styles.thumbnail.display = 'none';
        }
        return styles;
    }
    /**
     * On click handler.
     *
     * @returns {void}
     */
    _onClick() {
        const { _participant, dispatch, _stageFilmstripLayout } = this.props;
        const { id, pinned } = _participant;
        if (_stageFilmstripLayout) {
            dispatch((0, actions_4.togglePinStageParticipant)(id));
        }
        else {
            dispatch((0, actions_1.pinParticipant)(pinned ? null : id));
        }
    }
    /**
     * This is called as a onKeydown handler on the keyboard-only button to toggle pin.
     *
     * @param {KeyboardEvent} event - The keydown event.
     * @returns {void}
     */
    _onTogglePinButtonKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            this._onClick();
        }
    }
    /**
     * Keyboard focus handler.
     *
     * When navigating with keyboard, make things behave as we
     * hover with the mouse, to make the UI show up.
     *
     * @returns {void}
     */
    _onFocus() {
        this.setState({ isHovered: true });
    }
    /**
     * Keyboard blur handler.
     *
     * When navigating with keyboard, make things behave as we
     * hover with the mouse, to make the UI show up.
     *
     * @returns {void}
     */
    _onBlur() {
        // we need this timeout trick so that we get the actual document.activeElement value
        // instead of document.body
        setTimeout(() => {
            // we also explicitly check for popovers, because the thumbnail can show popovers,
            // and they are not rendered in the thumbnail DOM element
            if (!this.containerRef?.current?.contains(document.activeElement)
                && document.activeElement?.closest('.popover') === null) {
                this.setState({ isHovered: false });
            }
        }, 0);
    }
    /**
     * Mouse enter handler.
     *
     * @returns {void}
     */
    _onMouseEnter() {
        this.setState({ isHovered: true });
    }
    /**
     * Mouse move handler.
     *
     * @returns {void}
     */
    _onMouseMove() {
        if (!this.state.isHovered) {
            // Workaround for the use case where the layout changes (for example the participant pane is closed)
            // and as a result the mouse appears on top of the thumbnail. In these use cases the mouse enter
            // event on the thumbnail is not triggered in Chrome.
            this.setState({ isHovered: true });
        }
    }
    /**
     * Mouse leave handler.
     *
     * @returns {void}
     */
    _onMouseLeave() {
        this.setState({ isHovered: false });
    }
    /**
     * Handler for touch start.
     *
     * @returns {void}
     */
    _onTouchStart() {
        this.timeoutHandle = window.setTimeout(this._showPopover, constants_4.SHOW_TOOLBAR_CONTEXT_MENU_AFTER);
        if (this._firstTap) {
            this._clearDoubleClickTimeout();
            this._onClick();
            return;
        }
        this._firstTap = window.setTimeout(this._clearDoubleClickTimeout, 300);
    }
    /**
     * Cancel showing popover context menu after x milliseconds if the no. Of milliseconds is not reached yet,
     * or just clears the timeout.
     *
     * @returns {void}
     */
    _onTouchEnd() {
        clearTimeout(this.timeoutHandle);
    }
    /**
     * Cancel showing Context menu after x milliseconds if the number of milliseconds is not reached
     * before a touch move(drag), or just clears the timeout.
     *
     * @returns {void}
     */
    _onTouchMove() {
        clearTimeout(this.timeoutHandle);
    }
    /**
     * Renders a fake participant (youtube video) thumbnail.
     *
     * @param {string} id - The id of the participant.
     * @returns {ReactElement}
     */
    _renderFakeParticipant() {
        const { _isMobile, _participant: { avatarURL, pinned, name } } = this.props;
        const styles = this._getStyles();
        const containerClassName = this._getContainerClassName();
        return (react_1.default.createElement("span", { "aria-label": this.props.t(pinned ? 'unpinParticipant' : 'pinParticipant', {
                participantName: name
            }), className: containerClassName, id: 'sharedVideoContainer', onClick: this._onClick, onKeyDown: this._onTogglePinButtonKeyDown, ...(_isMobile ? {} : {
                onMouseEnter: this._onMouseEnter,
                onMouseMove: this._onMouseMove,
                onMouseLeave: this._onMouseLeave
            }), role: 'button', style: styles.thumbnail, tabIndex: 0 }, avatarURL ? (react_1.default.createElement("img", { alt: '', className: 'sharedVideoAvatar', src: avatarURL }))
            : this._renderAvatar(styles.avatar)));
    }
    /**
     * Renders the avatar.
     *
     * @param {Object} styles - The styles that will be applied to the avatar.
     * @returns {ReactElement}
     */
    _renderAvatar(styles) {
        const { _participant } = this.props;
        const { id } = _participant;
        return (react_1.default.createElement("div", { className: 'avatar-container', style: styles },
            react_1.default.createElement(Avatar_1.default, { className: 'userAvatar', participantId: id, size: this._getAvatarSize() })));
    }
    /**
     * Returns the container class name.
     *
     * @returns {string} - The class name that will be used for the container.
     */
    _getContainerClassName() {
        let className = 'videocontainer';
        const { displayMode } = this.state;
        const { _isDominantSpeakerDisabled, _participant, _raisedHand, _thumbnailType } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        className += ` ${constants_4.DISPLAY_MODE_TO_CLASS_NAME[displayMode]}`;
        if (_raisedHand) {
            className += ` ${classes.raisedHand}`;
        }
        if (!_isDominantSpeakerDisabled && _participant?.dominantSpeaker) {
            className += ` ${classes.activeSpeaker} dominant-speaker`;
        }
        if (_thumbnailType !== constants_4.THUMBNAIL_TYPE.TILE && _participant?.pinned) {
            className += ' videoContainerFocused';
        }
        return className;
    }
    /**
     * Keep showing the GIF for the current participant.
     *
     * @returns {void}
     */
    _onGifMouseEnter() {
        const { dispatch, _participant: { id } } = this.props;
        dispatch((0, actions_3.showGif)(id));
    }
    /**
     * Keep showing the GIF for the current participant.
     *
     * @returns {void}
     */
    _onGifMouseLeave() {
        const { dispatch, _participant: { id } } = this.props;
        dispatch((0, actions_3.hideGif)(id));
    }
    /**
     * Renders GIF.
     *
     * @returns {Component}
     */
    _renderGif() {
        const { _gifSrc } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        return _gifSrc && (react_1.default.createElement("div", { className: classes.gif },
            react_1.default.createElement("img", { alt: 'GIF', src: _gifSrc })));
    }
    /**
     * Canplay event listener.
     *
     * @returns {void}
     */
    _onCanPlay() {
        this.setState({ canPlayEventReceived: true });
    }
    /**
     * Renders a remote participant's 'thumbnail.
     *
     * @param {boolean} local - Whether or not it's the local participant.
     * @returns {ReactElement}
     */
    _renderParticipant(local = false) {
        const { _audioTrack, _disableLocalVideoFlip, _gifSrc, _isMobile, _isMobilePortrait, _isScreenSharing, _localFlipX, _participant, _shouldDisplayTintBackground, _thumbnailType, _videoTrack, filmstripType, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        const { id, name, pinned } = _participant || {};
        const { isHovered, popoverVisible } = this.state;
        const styles = this._getStyles();
        let containerClassName = this._getContainerClassName();
        const videoTrackClassName = !_disableLocalVideoFlip && _videoTrack && !_isScreenSharing && _localFlipX ? 'flipVideoX' : '';
        const jitsiVideoTrack = _videoTrack?.jitsiTrack;
        const videoTrackId = jitsiVideoTrack?.getId();
        const videoEventListeners = {};
        const pinButtonLabel = t(pinned ? 'unpinParticipant' : 'pinParticipant', {
            participantName: name
        });
        if (local) {
            if (_isMobilePortrait) {
                styles.thumbnail.height = styles.thumbnail.width;
                containerClassName = `${containerClassName} self-view-mobile-portrait`;
            }
        }
        else {
            videoEventListeners.onCanPlay = this._onCanPlay;
        }
        const video = _videoTrack && react_1.default.createElement(VideoTrack_1.default, { className: local ? videoTrackClassName : '', eventHandlers: videoEventListeners, id: local ? 'localVideo_container' : `remoteVideo_${videoTrackId || ''}`, muted: local ? undefined : true, style: styles.video, videoTrack: _videoTrack });
        return (react_1.default.createElement("span", { className: containerClassName, id: local
                ? `localVideoContainer${filmstripType === constants_4.FILMSTRIP_TYPE.MAIN ? '' : `_${filmstripType}`}`
                : `participant_${id}${filmstripType === constants_4.FILMSTRIP_TYPE.MAIN ? '' : `_${filmstripType}`}`, onBlur: this._onBlur, onFocus: this._onFocus, ...(_isMobile
                ? {
                    onTouchEnd: this._onTouchEnd,
                    onTouchMove: this._onTouchMove,
                    onTouchStart: this._onTouchStart
                }
                : {
                    onClick: this._onClick,
                    onMouseEnter: this._onMouseEnter,
                    onMouseMove: this._onMouseMove,
                    onMouseLeave: this._onMouseLeave
                }), ref: this.containerRef, style: styles.thumbnail },
            react_1.default.createElement(Tooltip_1.default, { content: pinButtonLabel },
                react_1.default.createElement("span", { "aria-label": pinButtonLabel, className: classes.keyboardPinButton, onKeyDown: this._onTogglePinButtonKeyDown, role: 'button', tabIndex: 0 })),
            !_gifSrc && (local
                ? react_1.default.createElement("span", { id: 'localVideoWrapper' }, video)
                : video),
            react_1.default.createElement("div", { className: classes.containerBackground }),
            react_1.default.createElement("div", { className: (0, clsx_1.default)(classes.indicatorsContainer, classes.indicatorsBottomContainer, _thumbnailType === constants_4.THUMBNAIL_TYPE.TILE && 'tile-view-mode') },
                react_1.default.createElement(ThumbnailBottomIndicators_1.default, { className: classes.indicatorsBackground, local: local, participantId: id, showStatusIndicators: !(0, functions_3.isWhiteboardParticipant)(_participant), thumbnailType: _thumbnailType })),
            react_1.default.createElement("div", { className: (0, clsx_1.default)(classes.indicatorsContainer, classes.indicatorsTopContainer, _thumbnailType === constants_4.THUMBNAIL_TYPE.TILE && 'tile-view-mode') },
                react_1.default.createElement(ThumbnailTopIndicators_1.default, { disableConnectionIndicator: (0, functions_3.isWhiteboardParticipant)(_participant), hidePopover: this._hidePopover, indicatorsClassName: classes.indicatorsBackground, isHovered: isHovered, local: local, participantId: id, popoverVisible: popoverVisible, showPopover: this._showPopover, thumbnailType: _thumbnailType })),
            _shouldDisplayTintBackground && react_1.default.createElement("div", { className: classes.tintBackground }),
            !_gifSrc && this._renderAvatar(styles.avatar),
            !local && (react_1.default.createElement("div", { className: 'presence-label-container' },
                react_1.default.createElement(PresenceLabel_1.default, { className: 'presence-label', participantID: id }))),
            react_1.default.createElement(ThumbnailAudioIndicator_1.default, { _audioTrack: _audioTrack }),
            this._renderGif(),
            react_1.default.createElement("div", { className: (0, clsx_1.default)(classes.borderIndicator, _gifSrc && classes.borderIndicatorOnTop, 'raised-hand-border') }),
            react_1.default.createElement("div", { className: (0, clsx_1.default)(classes.borderIndicator, _gifSrc && classes.borderIndicatorOnTop, 'active-speaker-indicator') }),
            _gifSrc && (react_1.default.createElement("div", { className: (0, clsx_1.default)(classes.borderIndicator, classes.borderIndicatorOnTop), onMouseEnter: this._onGifMouseEnter, onMouseLeave: this._onGifMouseLeave }))));
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _isVirtualScreenshareParticipant, _participant, _shouldDisplayTintBackground } = this.props;
        if (!_participant) {
            return null;
        }
        const { fakeParticipant, local } = _participant;
        if (local) {
            return this._renderParticipant(true);
        }
        if (fakeParticipant
            && !(0, functions_3.isWhiteboardParticipant)(_participant)
            && !_isVirtualScreenshareParticipant) {
            return this._renderFakeParticipant();
        }
        if (_isVirtualScreenshareParticipant) {
            const { isHovered } = this.state;
            const { _videoTrack, _isMobile, _thumbnailType } = this.props;
            const classes = mui_1.withStyles.getClasses(this.props);
            return (react_1.default.createElement(VirtualScreenshareParticipant_1.default, { classes: classes, containerClassName: this._getContainerClassName(), isHovered: isHovered, isLocal: (0, functions_3.isLocalScreenshareParticipant)(_participant), isMobile: _isMobile, onClick: this._onClick, onMouseEnter: this._onMouseEnter, onMouseLeave: this._onMouseLeave, onMouseMove: this._onMouseMove, onTouchEnd: this._onTouchEnd, onTouchMove: this._onTouchMove, onTouchStart: this._onTouchStart, participantId: _participant.id, shouldDisplayTintBackground: _shouldDisplayTintBackground, styles: this._getStyles(), thumbnailType: _thumbnailType, videoTrack: _videoTrack }));
        }
        return this._renderParticipant();
    }
}
/**
 * Maps (parts of) the redux state to the associated props for this component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The own props of the component.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const { participantID, filmstripType = constants_4.FILMSTRIP_TYPE.MAIN } = ownProps;
    const participant = (0, functions_3.getParticipantByIdOrUndefined)(state, participantID);
    const id = participant?.id ?? '';
    const isLocal = participant?.local ?? true;
    const _isVirtualScreenshareParticipant = (0, functions_3.isScreenShareParticipant)(participant);
    const tracks = state['features/base/tracks'];
    const _videoTrack = (0, functions_4.getVideoTrackByParticipant)(state, participant);
    const _audioTrack = isLocal
        ? (0, functions_4.getLocalAudioTrack)(tracks)
        : (0, functions_4.getTrackByMediaTypeAndParticipant)(tracks, constants_1.MEDIA_TYPE.AUDIO, id);
    const _currentLayout = (0, functions_web_1.getCurrentLayout)(state) ?? '';
    let size = {};
    let _isMobilePortrait = false;
    const { defaultLocalDisplayName, disableLocalVideoFlip, disableTileEnlargement, iAmRecorder, iAmSipGateway } = state['features/base/config'];
    const { localFlipX } = state['features/base/settings'];
    const _isMobile = (0, utils_1.isMobileBrowser)();
    const activeParticipants = (0, functions_7.getActiveParticipantsIds)(state);
    const tileType = (0, functions_7.getThumbnailTypeFromLayout)(_currentLayout, filmstripType);
    switch (tileType) {
        case constants_4.THUMBNAIL_TYPE.VERTICAL:
        case constants_4.THUMBNAIL_TYPE.HORIZONTAL: {
            const { horizontalViewDimensions = {
                local: { width: undefined,
                    height: undefined },
                remote: { width: undefined,
                    height: undefined }
            }, verticalViewDimensions = {
                local: { width: undefined,
                    height: undefined },
                remote: { width: undefined,
                    height: undefined },
                gridView: {}
            } } = state['features/filmstrip'];
            const _verticalViewGrid = (0, functions_7.showGridInVerticalView)(state);
            const { local, remote } = tileType === constants_4.THUMBNAIL_TYPE.VERTICAL
                ? verticalViewDimensions : horizontalViewDimensions;
            const { width, height } = (isLocal ? local : remote) ?? { width: undefined,
                height: undefined };
            size = {
                _width: width,
                _height: height
            };
            if (_verticalViewGrid) {
                // @ts-ignore
                const { width: _width, height: _height } = verticalViewDimensions.gridView.thumbnailSize;
                size = {
                    _width,
                    _height
                };
            }
            _isMobilePortrait = _isMobile && state['features/base/responsive-ui'].aspectRatio === constants_2.ASPECT_RATIO_NARROW;
            break;
        }
        case constants_4.THUMBNAIL_TYPE.TILE: {
            const { thumbnailSize } = state['features/filmstrip'].tileViewDimensions ?? { thumbnailSize: undefined };
            const { stageFilmstripDimensions = {
                thumbnailSize: {
                    height: undefined,
                    width: undefined
                }
            }, screenshareFilmstripDimensions = {
                thumbnailSize: {
                    height: undefined,
                    width: undefined
                }
            } } = state['features/filmstrip'];
            size = {
                _width: thumbnailSize?.width,
                _height: thumbnailSize?.height
            };
            if (filmstripType === constants_4.FILMSTRIP_TYPE.STAGE) {
                const { width: _width, height: _height } = stageFilmstripDimensions.thumbnailSize ?? {
                    width: undefined,
                    height: undefined
                };
                size = {
                    _width,
                    _height
                };
            }
            else if (filmstripType === constants_4.FILMSTRIP_TYPE.SCREENSHARE) {
                const { width: _width, height: _height } = screenshareFilmstripDimensions.thumbnailSize ?? {
                    width: undefined,
                    height: undefined
                };
                size = {
                    _width,
                    _height
                };
            }
            break;
        }
    }
    if (ownProps.width) {
        size._width = ownProps.width;
    }
    const { gifUrl: gifSrc } = (0, functions_6.getGifForParticipant)(state, id ?? '');
    const mode = (0, functions_6.getGifDisplayMode)(state);
    const participantId = isLocal ? (0, functions_3.getLocalParticipant)(state)?.id : participantID;
    const isActiveParticipant = activeParticipants.find((pId) => pId === participantId);
    const participantCurrentlyOnLargeVideo = state['features/large-video']?.participantId === id;
    const screenshareParticipantIds = (0, functions_3.getScreenshareParticipantIds)(state);
    const shouldDisplayTintBackground = _currentLayout !== constants_3.LAYOUTS.TILE_VIEW && filmstripType === constants_4.FILMSTRIP_TYPE.MAIN
        && (isActiveParticipant || participantCurrentlyOnLargeVideo)
        // skip showing tint for owner participants that are screensharing.
        && !screenshareParticipantIds.includes(id);
    return {
        _audioTrack,
        _currentLayout,
        _defaultLocalDisplayName: defaultLocalDisplayName,
        _disableLocalVideoFlip: Boolean(disableLocalVideoFlip),
        _disableTileEnlargement: Boolean(disableTileEnlargement),
        _isActiveParticipant: isActiveParticipant,
        _isHidden: isLocal && iAmRecorder && !iAmSipGateway,
        _isAudioOnly: Boolean(state['features/base/audio-only'].enabled),
        _isCurrentlyOnLargeVideo: participantCurrentlyOnLargeVideo,
        _isDominantSpeakerDisabled: interfaceConfig.DISABLE_DOMINANT_SPEAKER_INDICATOR,
        _isMobile,
        _isMobilePortrait,
        _isScreenSharing: _videoTrack?.videoType === 'desktop',
        _isVideoPlayable: id && (0, functions_7.isVideoPlayable)(state, id),
        _isVirtualScreenshareParticipant,
        _localFlipX: Boolean(localFlipX),
        _participant: participant,
        _raisedHand: (0, functions_3.hasRaisedHand)(participant),
        _stageFilmstripLayout: (0, functions_7.isStageFilmstripAvailable)(state),
        _stageParticipantsVisible: _currentLayout === constants_3.LAYOUTS.STAGE_FILMSTRIP_VIEW,
        _shouldDisplayTintBackground: shouldDisplayTintBackground,
        _thumbnailType: tileType,
        _videoObjectPosition: (0, functions_5.getVideoObjectPosition)(state, participant?.id),
        _videoTrack,
        ...size,
        _gifSrc: mode === 'chat' ? null : gifSrc
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)((0, mui_1.withStyles)((0, functions_2.translate)(Thumbnail), defaultStyles));
