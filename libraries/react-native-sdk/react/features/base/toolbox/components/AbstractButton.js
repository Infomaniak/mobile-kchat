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
exports.defaultDisabledButtonStyles = void 0;
const react_1 = __importStar(require("react"));
const types_1 = require("../../../toolbox/types");
const functions_any_1 = require("../../styles/functions.any");
const ToolboxItem_1 = __importDefault(require("./ToolboxItem"));
/**
 * Default style for disabled buttons.
 */
exports.defaultDisabledButtonStyles = {
    iconStyle: {
        opacity: 0.5
    },
    labelStyle: {
        opacity: 0.5
    },
    style: undefined,
    underlayColor: undefined
};
/**
 * An abstract implementation of a button.
 */
class AbstractButton extends react_1.Component {
    /**
     * Initializes a new {@code AbstractButton} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code AbstractButton} instance with.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onClick = this._onClick.bind(this);
    }
    /**
     * Helper function to be implemented by subclasses, which should be used
     * to handle a key being down.
     *
     * @protected
     * @returns {void}
     */
    _onKeyDown() {
        // To be implemented by subclass.
    }
    /**
     * Helper function to be implemented by subclasses, which should be used
     * to handle the button being clicked / pressed.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        // To be implemented by subclass.
    }
    /**
     * Helper function to be implemented by subclasses, which may return a
     * new React Element to be appended at the end of the button.
     *
     * @protected
     * @returns {ReactElement|null}
     */
    _getElementAfter() {
        return null;
    }
    /**
     * Gets the current icon, taking the toggled state into account. If no
     * toggled icon is provided, the regular icon will also be used in the
     * toggled state.
     *
     * @private
     * @returns {string}
     */
    _getIcon() {
        return (this._isToggled() ? this.toggledIcon : this.icon) || this.icon;
    }
    /**
     * Gets the current label, taking the toggled state into account. If no
     * toggled label is provided, the regular label will also be used in the
     * toggled state.
     *
     * @private
     * @returns {string}
     */
    _getLabel() {
        return (this._isToggled() ? this.toggledLabel : this.label)
            || this.label;
    }
    /**
     * Gets the current accessibility label, taking the toggled state into
     * account. If no toggled label is provided, the regular accessibility label
     * will also be used in the toggled state.
     *
     * The accessibility label is not visible in the UI, it is meant to be
     * used by assistive technologies, mainly screen readers.
     *
     * @private
     * @returns {string}
     */
    _getAccessibilityLabel() {
        return (this._isToggled()
            ? this.toggledAccessibilityLabel
            : this.accessibilityLabel) || this.accessibilityLabel;
    }
    /**
     * Gets the current styles, taking the toggled state into account. If no
     * toggled styles are provided, the regular styles will also be used in the
     * toggled state.
     *
     * @private
     * @returns {?Styles}
     */
    _getStyles() {
        const { disabledStyles, styles, toggledStyles } = this.props;
        const buttonStyles = (this._isToggled() ? toggledStyles : styles) || styles;
        if (this._isDisabled() && buttonStyles && disabledStyles) {
            return {
                iconStyle: (0, functions_any_1.combineStyles)(buttonStyles.iconStyle ?? {}, disabledStyles.iconStyle ?? {}),
                labelStyle: (0, functions_any_1.combineStyles)(buttonStyles.labelStyle ?? {}, disabledStyles.labelStyle ?? {}),
                style: (0, functions_any_1.combineStyles)(buttonStyles.style ?? {}, disabledStyles.style ?? {}),
                underlayColor: disabledStyles.underlayColor || buttonStyles.underlayColor
            };
        }
        return buttonStyles;
    }
    /**
     * Get the tooltip to display when hovering over the button.
     *
     * @private
     * @returns {string}
     */
    _getTooltip() {
        return (this._isToggled() ? this.toggledTooltip : this.tooltip)
            || this.tooltip
            || '';
    }
    /**
     * Helper function to be implemented by subclasses, which must return a
     * boolean value indicating if this button is disabled or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return false;
    }
    /**
     * Helper function to be implemented by subclasses, which must return a
     * {@code boolean} value indicating if this button is toggled or not or
     * undefined if the button is not toggleable.
     *
     * @protected
     * @returns {?boolean}
     */
    _isToggled() {
        return undefined;
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @param {Object} e - Event.
     * @private
     * @returns {void}
     */
    _onClick(e) {
        const { afterClick, buttonKey, handleClick, notifyMode } = this.props;
        if (typeof APP !== 'undefined' && notifyMode) {
            APP.API.notifyToolbarButtonClicked(buttonKey, notifyMode === types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY);
        }
        if (notifyMode !== types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY) {
            if (handleClick) {
                handleClick();
            }
            this._handleClick();
        }
        afterClick?.(e);
        // blur after click to release focus from button to allow PTT.
        // @ts-ignore
        e?.currentTarget?.blur && e.currentTarget.blur();
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Node}
     */
    render() {
        const props = {
            ...this.props,
            accessibilityLabel: this._getAccessibilityLabel(),
            elementAfter: this._getElementAfter(),
            icon: this._getIcon(),
            label: this._getLabel(),
            labelProps: this.labelProps,
            styles: this._getStyles(),
            toggled: this._isToggled(),
            tooltip: this._getTooltip()
        };
        return (react_1.default.createElement(ToolboxItem_1.default, { disabled: this._isDisabled(), onClick: this._onClick, onKeyDown: this._onKeyDown, ...props }));
    }
}
AbstractButton.defaultProps = {
    afterClick: undefined,
    disabledStyles: exports.defaultDisabledButtonStyles,
    showLabel: false,
    styles: undefined,
    toggledStyles: undefined,
    tooltipPosition: 'top',
    visible: true
};
exports.default = AbstractButton;
