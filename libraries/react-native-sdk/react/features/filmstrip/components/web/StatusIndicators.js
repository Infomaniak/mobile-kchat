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
const constants_1 = require("../../../base/media/constants");
const constants_2 = require("../../../base/participants/constants");
const functions_1 = require("../../../base/participants/functions");
const functions_web_1 = require("../../../base/tracks/functions.web");
const functions_web_2 = require("../../functions.web");
const AudioMutedIndicator_1 = __importDefault(require("./AudioMutedIndicator"));
const ModeratorIndicator_1 = __importDefault(require("./ModeratorIndicator"));
const ScreenShareIndicator_1 = __importDefault(require("./ScreenShareIndicator"));
/**
 * React {@code Component} for showing the status bar in a thumbnail.
 *
 * @augments Component
 */
class StatusIndicators extends react_1.Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _showAudioMutedIndicator, _showModeratorIndicator, _showScreenShareIndicator, thumbnailType } = this.props;
        const tooltipPosition = (0, functions_web_2.getIndicatorsTooltipPosition)(thumbnailType);
        return (react_1.default.createElement(react_1.default.Fragment, null,
            _showAudioMutedIndicator && react_1.default.createElement(AudioMutedIndicator_1.default, { tooltipPosition: tooltipPosition }),
            _showModeratorIndicator && react_1.default.createElement(ModeratorIndicator_1.default, { tooltipPosition: tooltipPosition }),
            _showScreenShareIndicator && react_1.default.createElement(ScreenShareIndicator_1.default, { tooltipPosition: tooltipPosition })));
    }
}
/**
 * Maps (parts of) the Redux state to the associated {@code StatusIndicators}'s props.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The own props of the component.
 * @private
 * @returns {{
 *     _showAudioMutedIndicator: boolean,
 *     _showModeratorIndicator: boolean,
 *     _showScreenShareIndicator: boolean
 * }}
*/
function _mapStateToProps(state, ownProps) {
    const { participantID, audio, moderator, screenshare } = ownProps;
    // Only the local participant won't have id for the time when the conference is not yet joined.
    const participant = (0, functions_1.getParticipantByIdOrUndefined)(state, participantID);
    const tracks = state['features/base/tracks'];
    let isAudioMuted = true;
    let isScreenSharing = false;
    if (participant?.local) {
        isAudioMuted = (0, functions_web_1.isLocalTrackMuted)(tracks, constants_1.MEDIA_TYPE.AUDIO);
    }
    else if (!participant?.fakeParticipant || (0, functions_1.isScreenShareParticipantById)(state, participantID)) {
        // remote participants excluding shared video
        const track = (0, functions_web_1.getVideoTrackByParticipant)(state, participant);
        isScreenSharing = track?.videoType === 'desktop';
        isAudioMuted = (0, functions_web_1.isRemoteTrackMuted)(tracks, constants_1.MEDIA_TYPE.AUDIO, participantID);
    }
    const { disableModeratorIndicator } = state['features/base/config'];
    return {
        _showAudioMutedIndicator: isAudioMuted && audio,
        _showModeratorIndicator: !disableModeratorIndicator && participant && participant.role === constants_2.PARTICIPANT_ROLE.MODERATOR && moderator,
        _showScreenShareIndicator: isScreenSharing && screenshare
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(StatusIndicators);
