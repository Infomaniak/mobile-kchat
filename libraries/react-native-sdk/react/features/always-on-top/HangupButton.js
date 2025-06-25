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
// We need to reference these files directly to avoid loading things that are not available
// in this environment (e.g. JitsiMeetJS or interfaceConfig)
const constants_1 = require("../base/icons/svg/constants");
const ToolbarButton_1 = __importDefault(require("./ToolbarButton"));
const { api } = window.alwaysOnTop;
/**
 * Stateless hangup button for the Always-on-Top windows.
 */
class HangupButton extends react_1.Component {
    /**
     * Initializes a new {@code HangupButton} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code HangupButton} instance with.
     */
    constructor(props) {
        super(props);
        this.accessibilityLabel = 'Hangup';
        this.icon = constants_1.DEFAULT_ICON.IconHangup;
        // Bind event handlers so they are only bound once per instance.
        this._onClick = this._onClick.bind(this);
    }
    /**
     * Handles clicking / pressing the button, and disconnects the conference.
     *
     * @protected
     * @returns {void}
     */
    _onClick() {
        api.executeCommand('hangup');
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (react_1.default.createElement(ToolbarButton_1.default, { accessibilityLabel: this.accessibilityLabel, customClass: 'hangup-button', icon: this.icon, onClick: this._onClick }));
    }
}
exports.default = HangupButton;
