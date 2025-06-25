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
const functions_1 = require("../../../base/i18n/functions");
const actions_1 = require("../../../base/settings/actions");
const functions_web_1 = require("../../../base/settings/functions.web");
const actions_web_1 = require("../../../base/tracks/actions.web");
const Checkbox_1 = __importDefault(require("../../../base/ui/components/web/Checkbox"));
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
/**
 * Component that displays the audio screen share helper dialog.
 */
class ShareAudioDialog extends react_1.Component {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onContinue = this._onContinue.bind(this);
        this._onSelectHideShareAudioHelper = this._onSelectHideShareAudioHelper.bind(this);
    }
    /**
     * Continue the normal screen sharing flow when the user clicks continue.
     *
     * @returns {boolean}
     */
    _onContinue() {
        // Pass undefined as the first parameter so the underlying logic decides weather or not to stop screen sharing.
        this.props.dispatch((0, actions_web_1.toggleScreensharing)(undefined, true));
        return true;
    }
    /**
     * Callback invoked when the hide audio helper checkbox has been selected. This setting will be persisted in
     * the local storage, thus the dialog won't be displayed again.
     *
     * @param {Object} e - The key event to handle.
     * @returns {void}
     */
    _onSelectHideShareAudioHelper({ target: { checked } }) {
        this.props.dispatch((0, actions_1.updateSettings)({ hideShareAudioHelper: checked }));
    }
    /**
     * Implements {@Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { t } = this.props;
        return (react_1.default.createElement(Dialog_1.default, { ok: { translationKey: 'dialog.shareAudio' }, onSubmit: this._onContinue, size: 'large', titleKey: t('dialog.shareAudioTitle') },
            react_1.default.createElement("div", { className: 'share-audio-dialog' },
                react_1.default.createElement("img", { alt: t('dialog.shareAudioAltText'), className: 'share-audio-animation', src: 'images/share-audio.gif', tabIndex: 0 }),
                react_1.default.createElement(Checkbox_1.default, { checked: this.props._shouldHideShareAudioHelper, label: t('dialog.hideShareAudioHelper'), name: 'hide-share-audio-helper', 
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange: this._onSelectHideShareAudioHelper }))));
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {IReduxState} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    return {
        _shouldHideShareAudioHelper: Boolean((0, functions_web_1.shouldHideShareAudioHelper)(state))
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(ShareAudioDialog));
