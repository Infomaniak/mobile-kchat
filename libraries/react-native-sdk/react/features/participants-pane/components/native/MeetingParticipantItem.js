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
const functions_1 = require("../../../base/i18n/functions");
const constants_1 = require("../../../base/media/constants");
const functions_2 = require("../../../base/participants/functions");
const functions_native_1 = require("../../../base/tracks/functions.native");
const actions_native_1 = require("../../actions.native");
const functions_3 = require("../../functions");
const ParticipantItem_1 = __importDefault(require("./ParticipantItem"));
/**
 * Implements the MeetingParticipantItem component.
 */
class MeetingParticipantItem extends react_1.PureComponent {
    /**
     * Creates new MeetingParticipantItem instance.
     *
     * @param {IProps} props - The props of the component.
     */
    constructor(props) {
        super(props);
        this._onPress = this._onPress.bind(this);
    }
    /**
     * Handles MeetingParticipantItem press events.
     *
     * @returns {void}
     */
    _onPress() {
        const { _fakeParticipant, _local, _localVideoOwner, _participantID, dispatch } = this.props;
        if (_fakeParticipant && _localVideoOwner) {
            dispatch((0, actions_native_1.showSharedVideoMenu)(_participantID));
        }
        else if (!_fakeParticipant) {
            dispatch((0, actions_native_1.showContextMenuDetails)(_participantID, _local));
        } // else no-op
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _audioMediaState, _disableModeratorIndicator, _displayName, _isModerator, _local, _participantID, _raisedHand, _videoMediaState } = this.props;
        return (<ParticipantItem_1.default audioMediaState={_audioMediaState} disableModeratorIndicator={_disableModeratorIndicator} displayName={_displayName} isModerator={_isModerator} local={_local} onPress={this._onPress} participantID={_participantID} raisedHand={_raisedHand} videoMediaState={_videoMediaState}/>);
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
function mapStateToProps(state, ownProps) {
    const { participant } = ownProps;
    const { ownerId } = state['features/shared-video'];
    const localParticipantId = (0, functions_2.getLocalParticipant)(state)?.id;
    const _isAudioMuted = (0, functions_any_1.getSsrcRewritingFeatureFlag)(state)
        ? Boolean(participant && (0, functions_2.getMutedStateByParticipantAndMediaType)(state, participant, constants_1.MEDIA_TYPE.AUDIO))
        : Boolean(participant && (0, functions_native_1.isParticipantAudioMuted)(participant, state));
    const _isVideoMuted = (0, functions_any_1.getSsrcRewritingFeatureFlag)(state)
        ? Boolean(participant && (0, functions_2.getMutedStateByParticipantAndMediaType)(state, participant, constants_1.MEDIA_TYPE.VIDEO))
        : (0, functions_native_1.isParticipantVideoMuted)(participant, state);
    const audioMediaState = (0, functions_3.getParticipantAudioMediaState)(participant, _isAudioMuted, state);
    const videoMediaState = (0, functions_3.getParticipantVideoMediaState)(participant, _isVideoMuted, state);
    const { disableModeratorIndicator } = state['features/base/config'];
    const raisedHand = (0, functions_2.hasRaisedHand)(participant?.local
        ? participant
        : (0, functions_2.getParticipantById)(state, participant?.id));
    return {
        _audioMediaState: audioMediaState,
        _disableModeratorIndicator: disableModeratorIndicator,
        _displayName: (0, functions_2.getParticipantDisplayName)(state, participant?.id),
        _fakeParticipant: participant?.fakeParticipant,
        _isAudioMuted,
        _isModerator: (0, functions_2.isParticipantModerator)(participant),
        _local: Boolean(participant?.local),
        _localVideoOwner: Boolean(ownerId === localParticipantId),
        _participantID: participant?.id,
        _raisedHand: raisedHand,
        _videoMediaState: videoMediaState
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(mapStateToProps)(MeetingParticipantItem));
