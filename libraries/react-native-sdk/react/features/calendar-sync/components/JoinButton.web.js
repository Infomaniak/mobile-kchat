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
const Icon_1 = __importDefault(require("../../base/icons/components/Icon"));
const svg_1 = require("../../base/icons/svg");
const Tooltip_1 = __importDefault(require("../../base/tooltip/components/Tooltip"));
/**
 * A React Component for joining an existing calendar meeting.
 *
 * @augments Component
 */
class JoinButton extends react_1.Component {
    /**
     * Initializes a new {@code JoinButton} instance.
     *
     * @param {*} props - The read-only properties with which the new instance
     * is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handler so it is only bound once for every instance.
        this._onClick = this._onClick.bind(this);
        this._onKeyPress = this._onKeyPress.bind(this);
    }
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { t } = this.props;
        return (react_1.default.createElement(Tooltip_1.default, { content: t('calendarSync.joinTooltip') },
            react_1.default.createElement("div", { className: 'button join-button', onClick: this._onClick, onKeyPress: this._onKeyPress, role: 'button' },
                react_1.default.createElement(Icon_1.default, { size: '14', src: svg_1.IconPlus }))));
    }
    /**
     * Callback invoked when the component is clicked.
     *
     * @param {Object} event - The DOM click event.
     * @private
     * @returns {void}
     */
    _onClick(event) {
        this.props.onPress(event, this.props.url);
    }
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyPress(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this._onClick();
        }
    }
}
exports.default = (0, functions_1.translate)(JoinButton);
