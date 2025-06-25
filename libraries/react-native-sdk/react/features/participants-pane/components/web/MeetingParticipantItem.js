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
const functions_any_1 = require("../../../base/config/functions.any");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const constants_1 = require("../../../base/media/constants");
const functions_1 = require("../../../base/participants/functions");
const functions_web_1 = require("../../../base/tracks/functions.web");
const constants_2 = require("../../constants");
const functions_2 = require("../../functions");
const ParticipantActionEllipsis_1 = __importDefault(require("./ParticipantActionEllipsis"));
const ParticipantItem_1 = __importDefault(require("./ParticipantItem"));
const ParticipantQuickAction_1 = __importDefault(require("./ParticipantQuickAction"));
/**
 * Implements the MeetingParticipantItem component.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactElement}
 */
function MeetingParticipantItem({ _audioMediaState, _audioTrack, _disableModeratorIndicator, _displayName, _local, _localVideoOwner, _matchesSearch, _participant, _participantID, _quickActionButtonType, _raisedHand, _videoMediaState, isHighlighted, isInBreakoutRoom, muteAudio, onContextMenu, onLeave, openDrawerForParticipant, overflowDrawer, participantActionEllipsisLabel, stopVideo, youText }) {
    const [hasAudioLevels, setHasAudioLevel] = (0, react_1.useState)(false);
    const [registeredEvent, setRegisteredEvent] = (0, react_1.useState)(false);
    const _updateAudioLevel = (0, react_1.useCallback)(level => {
        const audioLevel = typeof level === 'number' && !isNaN(level)
            ? level : 0;
        setHasAudioLevel(audioLevel > 0.009);
    }, []);
    (0, react_1.useEffect)(() => {
        if (_audioTrack && !registeredEvent) {
            const { jitsiTrack } = _audioTrack;
            if (jitsiTrack) {
                jitsiTrack.on(lib_jitsi_meet_1.JitsiTrackEvents.TRACK_AUDIO_LEVEL_CHANGED, _updateAudioLevel);
                setRegisteredEvent(true);
            }
        }
        return () => {
            if (_audioTrack && registeredEvent) {
                const { jitsiTrack } = _audioTrack;
                jitsiTrack?.off(lib_jitsi_meet_1.JitsiTrackEvents.TRACK_AUDIO_LEVEL_CHANGED, _updateAudioLevel);
            }
        };
    }, [_audioTrack]);
    if (!_matchesSearch) {
        return null;
    }
    const audioMediaState = _audioMediaState === constants_2.MEDIA_STATE.UNMUTED && hasAudioLevels
        ? constants_2.MEDIA_STATE.DOMINANT_SPEAKER : _audioMediaState;
    return (react_1.default.createElement(ParticipantItem_1.default, { actionsTrigger: constants_2.ACTION_TRIGGER.HOVER, ...(_participant?.fakeParticipant ? {} : {
            audioMediaState,
            videoMediaState: _videoMediaState
        }), disableModeratorIndicator: _disableModeratorIndicator, displayName: _displayName, isHighlighted: isHighlighted, isModerator: (0, functions_1.isParticipantModerator)(_participant), local: _local, onLeave: onLeave, openDrawerForParticipant: openDrawerForParticipant, overflowDrawer: overflowDrawer, participantID: _participantID, raisedHand: _raisedHand, youText: youText },
        !overflowDrawer && !_participant?.fakeParticipant
            && react_1.default.createElement(react_1.default.Fragment, null,
                !isInBreakoutRoom && (react_1.default.createElement(ParticipantQuickAction_1.default, { buttonType: _quickActionButtonType, muteAudio: muteAudio, participantID: _participantID, participantName: _displayName, stopVideo: stopVideo })),
                react_1.default.createElement(ParticipantActionEllipsis_1.default, { accessibilityLabel: participantActionEllipsisLabel, onClick: onContextMenu, participantID: _participantID })),
        !overflowDrawer && (_localVideoOwner || _participant?.fakeParticipant) && (react_1.default.createElement(ParticipantActionEllipsis_1.default, { accessibilityLabel: participantActionEllipsisLabel, onClick: onContextMenu }))));
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
    const { participantID, searchString } = ownProps;
    const { ownerId } = state['features/shared-video'];
    const localParticipantId = (0, functions_1.getLocalParticipant)(state)?.id;
    const participant = (0, functions_1.getParticipantByIdOrUndefined)(state, participantID);
    const _displayName = (0, functions_1.getParticipantDisplayName)(state, participant?.id ?? '');
    const _matchesSearch = (0, functions_2.participantMatchesSearch)(participant, searchString);
    const _isAudioMuted = (0, functions_any_1.getSsrcRewritingFeatureFlag)(state)
        ? Boolean(participant && (0, functions_1.getMutedStateByParticipantAndMediaType)(state, participant, constants_1.MEDIA_TYPE.AUDIO))
        : Boolean(participant && (0, functions_web_1.isParticipantAudioMuted)(participant, state));
    const _isVideoMuted = (0, functions_any_1.getSsrcRewritingFeatureFlag)(state)
        ? Boolean(participant && (0, functions_1.getMutedStateByParticipantAndMediaType)(state, participant, constants_1.MEDIA_TYPE.VIDEO))
        : (0, functions_web_1.isParticipantVideoMuted)(participant, state);
    const _audioMediaState = (0, functions_2.getParticipantAudioMediaState)(participant, _isAudioMuted, state);
    const _videoMediaState = (0, functions_2.getParticipantVideoMediaState)(participant, _isVideoMuted, state);
    const _quickActionButtonType = (0, functions_2.getQuickActionButtonType)(participant, _isAudioMuted, _isVideoMuted, state);
    const tracks = state['features/base/tracks'];
    const _audioTrack = participantID === localParticipantId
        ? (0, functions_web_1.getLocalAudioTrack)(tracks) : (0, functions_web_1.getTrackByMediaTypeAndParticipant)(tracks, constants_1.MEDIA_TYPE.AUDIO, participantID);
    const { disableModeratorIndicator } = state['features/base/config'];
    return {
        _audioMediaState,
        _audioTrack,
        _disableModeratorIndicator: Boolean(disableModeratorIndicator),
        _displayName,
        _local: Boolean(participant?.local),
        _localVideoOwner: Boolean(ownerId === localParticipantId),
        _matchesSearch,
        _participant: participant,
        _participantID: participant?.id ?? '',
        _quickActionButtonType,
        _raisedHand: (0, functions_1.hasRaisedHand)(participant),
        _videoMediaState
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(MeetingParticipantItem);
