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
const types_1 = require("../../../base/media/types");
const ToolboxButtonWithIcon_1 = __importDefault(require("../../../base/toolbox/components/web/ToolboxButtonWithIcon"));
const functions_web_1 = require("../../../base/tracks/functions.web");
const actions_1 = require("../../../settings/actions");
const VideoSettingsPopup_1 = __importDefault(require("../../../settings/components/web/video/VideoSettingsPopup"));
const functions_web_2 = require("../../../settings/functions.web");
const functions_web_3 = require("../../functions.web");
const VideoMuteButton_1 = __importDefault(require("./VideoMuteButton"));
/**
 * Button used for video & video settings.
 *
 * @returns {ReactElement}
 */
class VideoSettingsButton extends react_1.Component {
    /**
     * Initializes a new {@code VideoSettingsButton} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onEscClick = this._onEscClick.bind(this);
        this._onClick = this._onClick.bind(this);
    }
    /**
     * Returns true if the settings icon is disabled.
     *
     * @returns {boolean}
     */
    _isIconDisabled() {
        const { gumPending, hasPermissions, hasVideoTrack, isDisabled } = this.props;
        return ((!hasPermissions || isDisabled) && !hasVideoTrack) || gumPending !== types_1.IGUMPendingState.NONE;
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
     * @param {MouseEvent} e - Mousw event.
     * @returns {void}
     */
    _onClick(e) {
        const { onVideoOptionsClick, isOpen } = this.props;
        if (isOpen) {
            e?.stopPropagation();
        }
        onVideoOptionsClick();
    }
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { gumPending, t, visible, isOpen, buttonKey, notifyMode } = this.props;
        return visible ? (react_1.default.createElement(VideoSettingsPopup_1.default, null,
            react_1.default.createElement(ToolboxButtonWithIcon_1.default, { ariaControls: 'video-settings-dialog', ariaExpanded: isOpen, ariaHasPopup: true, ariaLabel: this.props.t('toolbar.videoSettings'), buttonKey: buttonKey, icon: svg_1.IconArrowUp, iconDisabled: this._isIconDisabled() || gumPending !== types_1.IGUMPendingState.NONE, iconId: 'video-settings-button', iconTooltip: t('toolbar.videoSettings'), notifyMode: notifyMode, onIconClick: this._onClick, onIconKeyDown: this._onEscClick },
                react_1.default.createElement(VideoMuteButton_1.default, { buttonKey: buttonKey, notifyMode: notifyMode })))) : react_1.default.createElement(VideoMuteButton_1.default, { buttonKey: buttonKey, notifyMode: notifyMode });
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
function mapStateToProps(state) {
    const { permissions = { video: false } } = state['features/base/devices'];
    const { isNarrowLayout } = state['features/base/responsive-ui'];
    const { gumPending } = state['features/base/media'].video;
    return {
        gumPending,
        hasPermissions: permissions.video,
        hasVideoTrack: Boolean((0, functions_web_1.getLocalJitsiVideoTrack)(state)),
        isDisabled: (0, functions_web_3.isVideoSettingsButtonDisabled)(state),
        isOpen: Boolean((0, functions_web_2.getVideoSettingsVisibility)(state)),
        visible: !(0, utils_1.isMobileBrowser)() && !isNarrowLayout
    };
}
const mapDispatchToProps = {
    onVideoOptionsClick: actions_1.toggleVideoSettings
};
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(VideoSettingsButton));
