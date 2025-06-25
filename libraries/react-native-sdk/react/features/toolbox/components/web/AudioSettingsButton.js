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
const utils_1 = require("../../../base/environment/utils");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const _1 = __importDefault(require("../../../base/lib-jitsi-meet/_"));
const types_1 = require("../../../base/media/types");
const ToolboxButtonWithIcon_1 = __importDefault(require("../../../base/toolbox/components/web/ToolboxButtonWithIcon"));
const actions_1 = require("../../../settings/actions");
const AudioSettingsPopup_1 = __importDefault(require("../../../settings/components/web/audio/AudioSettingsPopup"));
const functions_2 = require("../../../settings/functions");
const functions_3 = require("../../functions");
const AudioMuteButton_1 = __importDefault(require("./AudioMuteButton"));
/**
 * Button used for audio & audio settings.
 *
 * @returns {ReactElement}
 */
class AudioSettingsButton extends react_1.Component {
    /**
     * Initializes a new {@code AudioSettingsButton} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onEscClick = this._onEscClick.bind(this);
        this._onClick = this._onClick.bind(this);
    }
    /**
     * Click handler for the more actions entries.
     *
     * @param {KeyboardEvent} event - Esc key click to close the popup.
     * @returns {void}
     */
    _onEscClick(event) {
        if (event.key === 'Escape' && this.props.isOpen) {
            event.preventDefault();
            event.stopPropagation();
            this._onClick();
        }
    }
    /**
     * Click handler for the more actions entries.
     *
     * @param {MouseEvent} e - Mouse event.
     * @returns {void}
     */
    _onClick(e) {
        const { onAudioOptionsClick, isOpen } = this.props;
        if (isOpen) {
            e?.stopPropagation();
        }
        onAudioOptionsClick();
    }
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { gumPending, hasPermissions, isDisabled, visible, isOpen, buttonKey, notifyMode, t } = this.props;
        const settingsDisabled = !hasPermissions
            || isDisabled
            || !_1.default.mediaDevices.isMultipleAudioInputSupported();
        return visible ? (react_1.default.createElement(AudioSettingsPopup_1.default, null,
            react_1.default.createElement(ToolboxButtonWithIcon_1.default, { ariaControls: 'audio-settings-dialog', ariaExpanded: isOpen, ariaHasPopup: true, ariaLabel: t('toolbar.audioSettings'), buttonKey: buttonKey, icon: svg_1.IconArrowUp, iconDisabled: settingsDisabled || gumPending !== types_1.IGUMPendingState.NONE, iconId: 'audio-settings-button', iconTooltip: t('toolbar.audioSettings'), notifyMode: notifyMode, onIconClick: this._onClick, onIconKeyDown: this._onEscClick },
                react_1.default.createElement(AudioMuteButton_1.default, { buttonKey: buttonKey, notifyMode: notifyMode })))) : react_1.default.createElement(AudioMuteButton_1.default, { buttonKey: buttonKey, notifyMode: notifyMode });
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
function mapStateToProps(state) {
    const { permissions = { audio: false } } = state['features/base/devices'];
    const { isNarrowLayout } = state['features/base/responsive-ui'];
    const { gumPending } = state['features/base/media'].audio;
    return {
        gumPending,
        hasPermissions: permissions.audio,
        isDisabled: Boolean((0, functions_3.isAudioSettingsButtonDisabled)(state)),
        isOpen: Boolean((0, functions_2.getAudioSettingsVisibility)(state)),
        visible: !(0, utils_1.isMobileBrowser)() && !isNarrowLayout
    };
}
const mapDispatchToProps = {
    onAudioOptionsClick: actions_1.toggleAudioSettings
};
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(AudioSettingsButton));
