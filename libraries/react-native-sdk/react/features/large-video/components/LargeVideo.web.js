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
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
// @ts-expect-error
const VideoLayout_1 = __importDefault(require("../../../../modules/UI/videolayout/VideoLayout"));
const constants_1 = require("../../base/media/constants");
const functions_1 = require("../../base/participants/functions");
const Watermarks_1 = __importDefault(require("../../base/react/components/web/Watermarks"));
const functions_any_1 = require("../../base/settings/functions.any");
const functions_web_1 = require("../../base/tracks/functions.web");
const helpers_1 = require("../../base/util/helpers");
const StageParticipantNameLabel_1 = __importDefault(require("../../display-name/components/web/StageParticipantNameLabel"));
const constants_2 = require("../../filmstrip/constants");
const functions_web_2 = require("../../filmstrip/functions.web");
const SharedVideo_1 = __importDefault(require("../../shared-video/components/web/SharedVideo"));
const Captions_1 = __importDefault(require("../../subtitles/components/web/Captions"));
const actions_web_1 = require("../../video-layout/actions.web");
const Whiteboard_1 = __importDefault(require("../../whiteboard/components/web/Whiteboard"));
const functions_2 = require("../../whiteboard/functions");
const actions_web_2 = require("../actions.web");
const functions_3 = require("../functions");
const ScreenSharePlaceholder_web_1 = __importDefault(require("./ScreenSharePlaceholder.web"));
// Hack to detect Spot.
const SPOT_DISPLAY_NAME = 'Meeting Room';
/** .
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * The conference participant who is on the local stage) on Web/React.
 *
 * @augments Component
 */
class LargeVideo extends react_1.Component {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._containerRef = react_1.default.createRef();
        this._wrapperRef = react_1.default.createRef();
        this._clearTapTimeout = this._clearTapTimeout.bind(this);
        this._onDoubleTap = this._onDoubleTap.bind(this);
        this._updateLayout = this._updateLayout.bind(this);
    }
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        const { _visibleFilmstrip, _isScreenSharing, _seeWhatIsBeingShared, _largeVideoParticipantId, _hideSelfView, _localParticipantId } = this.props;
        if (prevProps._visibleFilmstrip !== _visibleFilmstrip) {
            this._updateLayout();
        }
        if (prevProps._isScreenSharing !== _isScreenSharing && !_isScreenSharing) {
            this.props.dispatch((0, actions_web_2.setSeeWhatIsBeingShared)(false));
        }
        if (_isScreenSharing && _seeWhatIsBeingShared) {
            VideoLayout_1.default.updateLargeVideo(_largeVideoParticipantId, true, true);
        }
        if (_largeVideoParticipantId === _localParticipantId
            && prevProps._hideSelfView !== _hideSelfView) {
            VideoLayout_1.default.updateLargeVideo(_largeVideoParticipantId, true, false);
        }
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Element}
     */
    render() {
        const { _displayScreenSharingPlaceholder, _isChatOpen, _noAutoPlayVideo, _showDominantSpeakerBadge, _whiteboardEnabled } = this.props;
        const style = this._getCustomStyles();
        const className = `videocontainer${_isChatOpen ? ' shift-right' : ''}`;
        return (react_1.default.createElement("div", { className: className, id: 'largeVideoContainer', ref: this._containerRef, style: style },
            react_1.default.createElement(SharedVideo_1.default, null),
            _whiteboardEnabled && react_1.default.createElement(Whiteboard_1.default, null),
            react_1.default.createElement("div", { id: 'etherpad' }),
            react_1.default.createElement(Watermarks_1.default, null),
            react_1.default.createElement("div", { id: 'dominantSpeaker', onTouchEnd: this._onDoubleTap },
                react_1.default.createElement("div", { className: 'dynamic-shadow' }),
                react_1.default.createElement("div", { id: 'dominantSpeakerAvatarContainer' })),
            react_1.default.createElement("div", { id: 'remotePresenceMessage' }),
            react_1.default.createElement("span", { id: 'remoteConnectionMessage' }),
            react_1.default.createElement("div", { id: 'largeVideoElementsContainer' },
                react_1.default.createElement("div", { id: 'largeVideoBackgroundContainer' }),
                _displayScreenSharingPlaceholder ? react_1.default.createElement(ScreenSharePlaceholder_web_1.default, null) : react_1.default.createElement(react_1.default.Fragment, null),
                react_1.default.createElement("div", { id: 'largeVideoWrapper', onTouchEnd: this._onDoubleTap, ref: this._wrapperRef, role: 'figure' },
                    react_1.default.createElement("video", { autoPlay: !_noAutoPlayVideo, id: 'largeVideo', muted: true, playsInline: true }))),
            interfaceConfig.DISABLE_TRANSCRIPTION_SUBTITLES
                || react_1.default.createElement(Captions_1.default, null),
            _showDominantSpeakerBadge && react_1.default.createElement(StageParticipantNameLabel_1.default, null)));
    }
    /**
     * Refreshes the video layout to determine the dimensions of the stage view.
     * If the filmstrip is toggled it adds CSS transition classes and removes them
     * when the transition is done.
     *
     * @returns {void}
     */
    _updateLayout() {
        const { _verticalFilmstripWidth, _resizableFilmstrip } = this.props;
        if (_resizableFilmstrip && Number(_verticalFilmstripWidth) >= constants_2.FILMSTRIP_BREAKPOINT) {
            this._containerRef.current?.classList.add('transition');
            this._wrapperRef.current?.classList.add('transition');
            VideoLayout_1.default.refreshLayout();
            setTimeout(() => {
                this._containerRef?.current && this._containerRef.current.classList.remove('transition');
                this._wrapperRef?.current && this._wrapperRef.current.classList.remove('transition');
            }, 1000);
        }
        else {
            VideoLayout_1.default.refreshLayout();
        }
    }
    /**
     * Clears the '_tappedTimout'.
     *
     * @private
     * @returns {void}
     */
    _clearTapTimeout() {
        clearTimeout(this._tappedTimeout);
        this._tappedTimeout = undefined;
    }
    /**
     * Creates the custom styles object.
     *
     * @private
     * @returns {Object}
     */
    _getCustomStyles() {
        const styles = {};
        const { _customBackgroundColor, _customBackgroundImageUrl, _verticalFilmstripWidth, _verticalViewMaxWidth, _visibleFilmstrip } = this.props;
        styles.backgroundColor = _customBackgroundColor || interfaceConfig.DEFAULT_BACKGROUND;
        if (this.props._backgroundAlpha !== undefined) {
            const alphaColor = (0, helpers_1.setColorAlpha)(styles.backgroundColor, this.props._backgroundAlpha);
            styles.backgroundColor = alphaColor;
        }
        if (_customBackgroundImageUrl) {
            styles.backgroundImage = `url(${_customBackgroundImageUrl})`;
            styles.backgroundSize = 'cover';
        }
        if (_visibleFilmstrip && Number(_verticalFilmstripWidth) >= constants_2.FILMSTRIP_BREAKPOINT) {
            styles.width = `calc(100% - ${_verticalViewMaxWidth || 0}px)`;
        }
        return styles;
    }
    /**
     * Sets view to tile view on double tap.
     *
     * @param {Object} e - The event.
     * @private
     * @returns {void}
     */
    _onDoubleTap(e) {
        e.stopPropagation();
        e.preventDefault();
        if (this._tappedTimeout) {
            this._clearTapTimeout();
            this.props.dispatch((0, actions_web_1.setTileView)(true));
        }
        else {
            this._tappedTimeout = window.setTimeout(this._clearTapTimeout, 300);
        }
    }
}
/**
 * Maps (parts of) the Redux state to the associated LargeVideo props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const testingConfig = state['features/base/config'].testing;
    const { backgroundColor, backgroundImageUrl } = state['features/dynamic-branding'];
    const { isOpen: isChatOpen } = state['features/chat'];
    const { width: verticalFilmstripWidth, visible } = state['features/filmstrip'];
    const { defaultLocalDisplayName, hideDominantSpeakerBadge } = state['features/base/config'];
    const { seeWhatIsBeingShared } = state['features/large-video'];
    const localParticipantId = (0, functions_1.getLocalParticipant)(state)?.id;
    const largeVideoParticipant = (0, functions_3.getLargeVideoParticipant)(state);
    const videoTrack = (0, functions_web_1.getVideoTrackByParticipant)(state, largeVideoParticipant);
    const isLocalScreenshareOnLargeVideo = largeVideoParticipant?.id?.includes(localParticipantId ?? '')
        && videoTrack?.videoType === constants_1.VIDEO_TYPE.DESKTOP;
    const isOnSpot = defaultLocalDisplayName === SPOT_DISPLAY_NAME;
    return {
        _backgroundAlpha: state['features/base/config'].backgroundAlpha,
        _customBackgroundColor: backgroundColor,
        _customBackgroundImageUrl: backgroundImageUrl,
        _displayScreenSharingPlaceholder: Boolean(isLocalScreenshareOnLargeVideo && !seeWhatIsBeingShared && !isOnSpot),
        _hideSelfView: (0, functions_any_1.getHideSelfView)(state),
        _isChatOpen: isChatOpen,
        _isScreenSharing: Boolean(isLocalScreenshareOnLargeVideo),
        _largeVideoParticipantId: largeVideoParticipant?.id ?? '',
        _localParticipantId: localParticipantId ?? '',
        _noAutoPlayVideo: Boolean(testingConfig?.noAutoPlayVideo),
        _resizableFilmstrip: (0, functions_web_2.isFilmstripResizable)(state),
        _seeWhatIsBeingShared: Boolean(seeWhatIsBeingShared),
        _showDominantSpeakerBadge: !hideDominantSpeakerBadge,
        _verticalFilmstripWidth: verticalFilmstripWidth.current,
        _verticalViewMaxWidth: (0, functions_web_2.getVerticalViewMaxWidth)(state),
        _visibleFilmstrip: visible,
        _whiteboardEnabled: (0, functions_2.isWhiteboardEnabled)(state)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(LargeVideo);
