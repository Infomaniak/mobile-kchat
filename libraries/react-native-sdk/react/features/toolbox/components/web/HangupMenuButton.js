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
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const functions_2 = require("../../../base/i18n/functions");
const Popover_web_1 = __importDefault(require("../../../base/popover/components/Popover.web"));
const HangupToggleButton_1 = __importDefault(require("./HangupToggleButton"));
/**
 * A React {@code Component} for opening or closing the {@code HangupMenu}.
 *
 * @augments Component
 */
class HangupMenuButton extends react_1.Component {
    /**
     * Initializes a new {@code HangupMenuButton} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onCloseDialog = this._onCloseDialog.bind(this);
        this._toggleDialogVisibility
            = this._toggleDialogVisibility.bind(this);
        this._onEscClick = this._onEscClick.bind(this);
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
            this._onCloseDialog();
        }
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { children, isOpen, t } = this.props;
        return (react_1.default.createElement("div", { className: 'toolbox-button-wth-dialog context-menu' },
            react_1.default.createElement(Popover_web_1.default, { content: children, headingLabel: t('toolbar.accessibilityLabel.hangup'), onPopoverClose: this._onCloseDialog, position: 'top', trigger: 'click', visible: isOpen },
                react_1.default.createElement(HangupToggleButton_1.default, { buttonKey: 'hangup-menu', customClass: 'hangup-menu-button', handleClick: this._toggleDialogVisibility, isOpen: isOpen, notifyMode: this.props.notifyMode, onKeyDown: this._onEscClick }))));
    }
    /**
     * Callback invoked when {@code InlineDialog} signals that it should be
     * close.
     *
     * @private
     * @returns {void}
     */
    _onCloseDialog() {
        this.props.onVisibilityChange(false);
    }
    /**
     * Callback invoked to signal that an event has occurred that should change
     * the visibility of the {@code InlineDialog} component.
     *
     * @private
     * @returns {void}
     */
    _toggleDialogVisibility() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('hangup'));
        this.props.onVisibilityChange(!this.props.isOpen);
    }
}
exports.default = (0, functions_2.translate)(HangupMenuButton);
