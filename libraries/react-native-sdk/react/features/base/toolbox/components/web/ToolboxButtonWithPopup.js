"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const Popover_web_1 = __importDefault(require("../../../popover/components/Popover.web"));
/**
 * Displays the `ToolboxButtonWithIcon` component.
 *
 * @param {Object} props - Component's props.
 * @returns {ReactElement}
 */
function ToolboxButtonWithPopup(props) {
    const { ariaLabel, children, icon, iconDisabled, onPopoverClose, onPopoverOpen, popoverContent, styles, trigger, visible } = props;
    if (!icon) {
        return (react_1.default.createElement("div", { className: 'settings-button-container', style: styles },
            react_1.default.createElement(Popover_web_1.default, { content: popoverContent, headingLabel: ariaLabel, onPopoverClose: onPopoverClose, onPopoverOpen: onPopoverOpen, position: 'top', trigger: trigger, visible: visible }, children)));
    }
    return (react_1.default.createElement("div", { className: 'settings-button-container', style: styles },
        children,
        react_1.default.createElement("div", { className: 'settings-button-small-icon-container' },
            react_1.default.createElement(Popover_web_1.default, { content: popoverContent, headingLabel: ariaLabel, onPopoverClose: onPopoverClose, onPopoverOpen: onPopoverOpen, position: 'top', visible: visible },
                react_1.default.createElement(Icon_1.default, { alt: ariaLabel, className: `settings-button-small-icon ${iconDisabled
                        ? 'settings-button-small-icon--disabled'
                        : ''}`, size: 16, src: icon })))));
}
exports.default = ToolboxButtonWithPopup;
