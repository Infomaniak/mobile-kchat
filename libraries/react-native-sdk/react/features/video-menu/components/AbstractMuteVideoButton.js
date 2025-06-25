"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_1 = require("../../base/dialog/actions");
const svg_1 = require("../../base/icons/svg");
const constants_1 = require("../../base/media/constants");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const functions_any_1 = require("../../base/tracks/functions.any");
const _1 = require("./");
/**
 * An abstract remote video menu button which mutes the remote participant.
 */
class AbstractMuteVideoButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.remoteVideoMute';
        this.icon = svg_1.IconVideoOff;
        this.label = 'videothumbnail.domuteVideo';
        this.toggledLabel = 'videothumbnail.videoMuted';
    }
    /**
     * Handles clicking / pressing the button, and mutes the participant.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, participantID } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRemoteVideoMenuButtonEvent)('video.mute.button', {
            'participant_id': participantID
        }));
        dispatch((0, actions_1.openDialog)(_1.MuteRemoteParticipantsVideoDialog, { participantID }));
    }
    /**
     * Renders the item disabled if the participant is muted.
     *
     * @inheritdoc
     */
    _isDisabled() {
        return this.props._videoTrackMuted;
    }
    /**
     * Renders the item toggled if the participant is muted.
     *
     * @inheritdoc
     */
    _isToggled() {
        return this.props._videoTrackMuted;
    }
}
exports.default = AbstractMuteVideoButton;
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Object} ownProps - Properties of component.
 * @private
 * @returns {{
 *      _videoTrackMuted: boolean
 *  }}
 */
function _mapStateToProps(state, ownProps) {
    const tracks = state['features/base/tracks'];
    return {
        _videoTrackMuted: (0, functions_any_1.isRemoteTrackMuted)(tracks, constants_1.MEDIA_TYPE.VIDEO, ownProps.participantID)
    };
}
exports._mapStateToProps = _mapStateToProps;
