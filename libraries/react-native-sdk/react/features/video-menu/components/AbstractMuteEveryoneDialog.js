"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.abstractMapStateToProps = void 0;
const actions_1 = require("../../av-moderation/actions");
const functions_1 = require("../../av-moderation/functions");
const constants_1 = require("../../base/media/constants");
const functions_2 = require("../../base/participants/functions");
const actions_2 = require("../actions");
const AbstractMuteRemoteParticipantDialog_1 = __importDefault(require("./AbstractMuteRemoteParticipantDialog"));
/**
 *
 * An abstract Component with the contents for a dialog that asks for confirmation
 * from the user before muting all remote participants.
 *
 * @augments AbstractMuteRemoteParticipantDialog
 */
class AbstractMuteEveryoneDialog extends AbstractMuteRemoteParticipantDialog_1.default {
    /**
     * Initializes a new {@code AbstractMuteRemoteParticipantDialog} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            audioModerationEnabled: props.isAudioModerationEnabled,
            content: props.content || props.t(props.isAudioModerationEnabled
                ? 'dialog.muteEveryoneDialogModerationOn' : 'dialog.muteEveryoneDialog')
        };
        // Bind event handlers so they are only bound once per instance.
        this._onSubmit = this._onSubmit.bind(this);
        this._onToggleModeration = this._onToggleModeration.bind(this);
    }
    /**
      * Toggles advanced moderation switch.
      *
      * @returns {void}
      */
    _onToggleModeration() {
        this.setState(state => {
            return {
                audioModerationEnabled: !state.audioModerationEnabled,
                content: this.props.t(state.audioModerationEnabled
                    ? 'dialog.muteEveryoneDialog' : 'dialog.muteEveryoneDialogModerationOn')
            };
        });
    }
    /**
     * Callback to be invoked when the value of this dialog is submitted.
     *
     * @returns {boolean}
     */
    _onSubmit() {
        const { dispatch, exclude } = this.props;
        dispatch((0, actions_2.muteAllParticipants)(exclude, constants_1.MEDIA_TYPE.AUDIO));
        if (this.state.audioModerationEnabled) {
            dispatch((0, actions_1.requestEnableAudioModeration)());
        }
        else if (this.state.audioModerationEnabled !== undefined) {
            dispatch((0, actions_1.requestDisableAudioModeration)());
        }
        return true;
    }
}
AbstractMuteEveryoneDialog.defaultProps = {
    exclude: [],
    muteLocal: false
};
exports.default = AbstractMuteEveryoneDialog;
/**
 * Maps (parts of) the Redux state to the associated {@code AbstractMuteEveryoneDialog}'s props.
 *
 * @param {IReduxState} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component.
 * @returns {IProps}
 */
function abstractMapStateToProps(state, ownProps) {
    const { exclude = [], t } = ownProps;
    const whom = exclude
        // eslint-disable-next-line no-confusing-arrow
        .map(id => id === (0, functions_2.getLocalParticipant)(state)?.id
        ? t('dialog.muteEveryoneSelf')
        : (0, functions_2.getParticipantDisplayName)(state, id))
        .join(', ');
    return whom.length ? {
        content: t('dialog.muteEveryoneElseDialog'),
        title: t('dialog.muteEveryoneElseTitle', { whom })
    } : {
        title: t('dialog.muteEveryoneTitle'),
        isAudioModerationEnabled: (0, functions_1.isEnabledFromState)(constants_1.MEDIA_TYPE.AUDIO, state),
        isModerationSupported: (0, functions_1.isSupported)()(state)
    };
}
exports.abstractMapStateToProps = abstractMapStateToProps;
