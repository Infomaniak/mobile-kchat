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
const functions_1 = require("../../base/i18n/functions");
const Platform_web_1 = __importDefault(require("../../base/react/Platform.web"));
const Checkbox_1 = __importDefault(require("../../base/ui/components/web/Checkbox"));
const Spinner_1 = __importDefault(require("../../base/ui/components/web/Spinner"));
const DesktopSourcePreview_1 = __importDefault(require("./DesktopSourcePreview"));
/**
 * React component for showing a grid of DesktopSourcePreviews.
 *
 * @augments Component
 */
class DesktopPickerPane extends react_1.Component {
    /**
     * Initializes a new DesktopPickerPane instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this._onShareAudioCheck = this._onShareAudioCheck.bind(this);
    }
    /**
     * Function to be called when the Checkbox is used.
     *
     * @param {boolean} checked - Checkbox status (checked or not).
     * @returns {void}
     */
    _onShareAudioCheck({ target: { checked } }) {
        this.props.onShareAudioChecked(checked);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { onClick, onDoubleClick, selectedSourceId, sources, type, t } = this.props;
        const classNames = `desktop-picker-pane default-scrollbar source-type-${type}`;
        const previews = sources
            ? sources.map(source => (react_1.default.createElement(DesktopSourcePreview_1.default, { key: source.id, onClick: onClick, onDoubleClick: onDoubleClick, selected: source.id === selectedSourceId, source: source, type: type })))
            : (react_1.default.createElement("div", { className: 'desktop-picker-pane-spinner' },
                react_1.default.createElement(Spinner_1.default, null)));
        let checkBox;
        // Only display the share audio checkbox if we're on windows and on
        // desktop sharing tab.
        // App window and Mac OS screen sharing doesn't work with system audio.
        if (type === 'screen' && Platform_web_1.default.OS === 'windows') {
            checkBox = (react_1.default.createElement(Checkbox_1.default, { label: t('dialog.screenSharingAudio'), name: 'share-system-audio', onChange: this._onShareAudioCheck }));
        }
        return (react_1.default.createElement("div", { className: classNames },
            previews,
            checkBox));
    }
}
exports.default = (0, functions_1.translate)(DesktopPickerPane);
