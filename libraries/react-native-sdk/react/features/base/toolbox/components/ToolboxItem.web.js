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
const Icon_1 = __importDefault(require("../../icons/components/Icon"));
const Tooltip_1 = __importDefault(require("../../tooltip/components/Tooltip"));
const ContextMenuItem_1 = __importDefault(require("../../ui/components/web/ContextMenuItem"));
const AbstractToolboxItem_1 = __importDefault(require("./AbstractToolboxItem"));
/**
 * Web implementation of {@code AbstractToolboxItem}.
 */
class ToolboxItem extends AbstractToolboxItem_1.default {
    /**
     * Initializes a new {@code ToolboxItem} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onKeyPress = this._onKeyPress.bind(this);
    }
    /**
     * Handles 'Enter' and Space key on the button to trigger onClick for accessibility.
     *
     * @param {Object} event - The key event.
     * @private
     * @returns {void}
     */
    _onKeyPress(event) {
        if (event?.key === 'Enter') {
            event.preventDefault();
            this.props.onClick();
        }
    }
    /**
     * Handles rendering of the actual item. If the label is being shown, which
     * is controlled with the `showLabel` prop, the item is rendered for its
     * display in an overflow menu, otherwise it will only have an icon, which
     * can be displayed on any toolbar.
     *
     * @protected
     * @returns {ReactElement}
     */
    _renderItem() {
        const { backgroundColor, contextMenu, isMenuButton, disabled, elementAfter, icon, onClick, onKeyDown, showLabel, tooltipPosition, toggled } = this.props;
        const className = showLabel ? 'overflow-menu-item' : 'toolbox-button';
        const buttonAttribute = isMenuButton ? 'aria-expanded' : 'aria-pressed';
        const props = {
            [buttonAttribute]: toggled,
            'aria-disabled': disabled,
            'aria-label': this.accessibilityLabel,
            className: className + (disabled ? ' disabled' : ''),
            onClick: disabled ? undefined : onClick,
            onKeyDown: disabled ? undefined : onKeyDown,
            onKeyPress: this._onKeyPress,
            tabIndex: 0,
            role: 'button'
        };
        const elementType = showLabel ? 'li' : 'div';
        const useTooltip = this.tooltip && this.tooltip.length > 0;
        if (contextMenu) {
            return (react_1.default.createElement(ContextMenuItem_1.default, { accessibilityLabel: this.accessibilityLabel, backgroundColor: backgroundColor, disabled: disabled, icon: icon, onClick: onClick, onKeyDown: onKeyDown, onKeyPress: this._onKeyPress, text: this.label }));
        }
        let children = (react_1.default.createElement(react_1.Fragment, null,
            this._renderIcon(),
            showLabel && react_1.default.createElement("span", null, this.label),
            elementAfter));
        if (useTooltip) {
            children = (react_1.default.createElement(Tooltip_1.default, { content: this.tooltip ?? '', position: tooltipPosition }, children));
        }
        return react_1.default.createElement(elementType, props, children);
    }
    /**
     * Helper function to render the item's icon.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderIcon() {
        const { backgroundColor, customClass, disabled, icon, showLabel, toggled } = this.props;
        const iconComponent = (react_1.default.createElement(Icon_1.default, { size: showLabel ? undefined : 24, src: icon }));
        const elementType = showLabel ? 'span' : 'div';
        const className = `${showLabel ? 'overflow-menu-item-icon' : 'toolbox-icon'} ${toggled ? 'toggled' : ''} ${disabled ? 'disabled' : ''} ${customClass ?? ''}`;
        const style = backgroundColor && !showLabel ? { backgroundColor } : {};
        return react_1.default.createElement(elementType, {
            className,
            style
        }, iconComponent);
    }
}
exports.default = ToolboxItem;
