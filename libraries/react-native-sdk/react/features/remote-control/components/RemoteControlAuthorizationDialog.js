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
const functions_1 = require("../../base/i18n/functions");
const functions_2 = require("../../base/participants/functions");
const functions_any_1 = require("../../base/tracks/functions.any");
const Dialog_1 = __importDefault(require("../../base/ui/components/web/Dialog"));
const actions_1 = require("../actions");
/**
 * Implements a dialog for remote control authorization.
 */
class RemoteControlAuthorizationDialog extends react_1.Component {
    /**
     * Initializes a new RemoteControlAuthorizationDialog instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this._onCancel = this._onCancel.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        return (react_1.default.createElement(Dialog_1.default, { ok: { translationKey: 'dialog.allow' }, onCancel: this._onCancel, onSubmit: this._onSubmit, titleKey: 'dialog.remoteControlTitle' },
            this.props.t('dialog.remoteControlRequestMessage', { user: this.props._displayName }),
            this._getAdditionalMessage()));
    }
    /**
     * Renders additional message text for the dialog.
     *
     * @private
     * @returns {ReactElement}
     */
    _getAdditionalMessage() {
        const { _isScreenSharing, _sourceType } = this.props;
        if (_isScreenSharing && _sourceType === 'screen') {
            return null;
        }
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("br", null),
            this.props.t('dialog.remoteControlShareScreenWarning')));
    }
    /**
     * Notifies the remote control module about the denial of the remote control
     * request.
     *
     * @private
     * @returns {boolean} Returns true to close the dialog.
     */
    _onCancel() {
        const { dispatch, participantId } = this.props;
        dispatch((0, actions_1.deny)(participantId));
        return true;
    }
    /**
     * Notifies the remote control module that the remote control request is
     * accepted.
     *
     * @private
     * @returns {boolean} Returns false to prevent closure because the dialog is
     * closed manually to be sure that if the desktop picker dialog can be
     * displayed (if this dialog is displayed when we try to display the desktop
     * picker window, the action will be ignored).
     */
    _onSubmit() {
        const { dispatch, participantId } = this.props;
        dispatch((0, actions_1.grant)(participantId));
        return false;
    }
}
/**
 * Maps (parts of) the Redux state to the RemoteControlAuthorizationDialog's
 * props.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The React Component props passed to the associated
 * (instance of) RemoteControlAuthorizationDialog.
 * @private
 * @returns {{
 *     _displayName: string,
 *     _isScreenSharing: boolean,
 *     _sourceId: string,
 *     _sourceType: string
 * }}
 */
function _mapStateToProps(state, ownProps) {
    const { _displayName, participantId } = ownProps;
    const participant = (0, functions_2.getParticipantById)(state, participantId);
    const tracks = state['features/base/tracks'];
    const track = (0, functions_any_1.getLocalVideoTrack)(tracks);
    const _isScreenSharing = track?.videoType === 'desktop';
    const { sourceType } = track?.jitsiTrack || {};
    return {
        _displayName: participant ? participant.name : _displayName,
        _isScreenSharing,
        _sourceType: sourceType
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(RemoteControlAuthorizationDialog));
