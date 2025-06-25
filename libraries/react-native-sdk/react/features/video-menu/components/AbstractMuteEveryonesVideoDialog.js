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
const AbstractMuteRemoteParticipantsVideoDialog_1 = __importDefault(require("./AbstractMuteRemoteParticipantsVideoDialog"));
/**
 *
 * An abstract Component with the contents for a dialog that asks for confirmation
 * from the user before disabling all remote participants cameras.
 *
 * @augments AbstractMuteRemoteParticipantsVideoDialog
 */
class AbstractMuteEveryonesVideoDialog extends AbstractMuteRemoteParticipantsVideoDialog_1.default {
    /**
     * Initializes a new {@code AbstractMuteRemoteParticipantsVideoDialog} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            moderationEnabled: props.isVideoModerationEnabled,
            content: props.content || props.t(props.isVideoModerationEnabled
                ? 'dialog.muteEveryonesVideoDialogModerationOn' : 'dialog.muteEveryonesVideoDialog')
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
                moderationEnabled: !state.moderationEnabled,
                content: this.props.t(state.moderationEnabled
                    ? 'dialog.muteEveryonesVideoDialog' : 'dialog.muteEveryonesVideoDialogModerationOn')
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
        dispatch((0, actions_2.muteAllParticipants)(exclude, constants_1.MEDIA_TYPE.VIDEO));
        if (this.state.moderationEnabled) {
            dispatch((0, actions_1.requestEnableVideoModeration)());
        }
        else if (this.state.moderationEnabled !== undefined) {
            dispatch((0, actions_1.requestDisableVideoModeration)());
        }
        return true;
    }
}
AbstractMuteEveryonesVideoDialog.defaultProps = {
    exclude: [],
    muteLocal: false
};
exports.default = AbstractMuteEveryonesVideoDialog;
/**
 * Maps (parts of) the Redux state to the associated {@code AbstractMuteEveryonesVideoDialog}'s props.
 *
 * @param {IReduxState} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component.
 * @returns {IProps}
 */
function abstractMapStateToProps(state, ownProps) {
    const { exclude = [], t } = ownProps;
    const isVideoModerationEnabled = (0, functions_1.isEnabledFromState)(constants_1.MEDIA_TYPE.VIDEO, state);
    const whom = exclude
        // eslint-disable-next-line no-confusing-arrow
        .map(id => id === (0, functions_2.getLocalParticipant)(state)?.id
        ? t('dialog.muteEveryoneSelf')
        : (0, functions_2.getParticipantDisplayName)(state, id))
        .join(', ');
    return whom.length ? {
        content: t('dialog.muteEveryoneElsesVideoDialog'),
        title: t('dialog.muteEveryoneElsesVideoTitle', { whom })
    } : {
        title: t('dialog.muteEveryonesVideoTitle'),
        isVideoModerationEnabled,
        isModerationSupported: (0, functions_1.isSupported)()(state)
    };
}
exports.abstractMapStateToProps = abstractMapStateToProps;
