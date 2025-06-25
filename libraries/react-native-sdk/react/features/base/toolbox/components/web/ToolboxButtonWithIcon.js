"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const types_1 = require("../../../../toolbox/types");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const Tooltip_1 = __importDefault(require("../../../tooltip/components/Tooltip"));
/**
 * Displays the `ToolboxButtonWithIcon` component.
 *
 * @param {Object} props - Component's props.
 * @returns {ReactElement}
 */
function ToolboxButtonWithIcon(props) {
    const { children, icon, iconDisabled, iconTooltip, buttonKey, notifyMode, onIconClick, onIconKeyDown, styles, ariaLabel, ariaHasPopup, ariaControls, ariaExpanded, iconId } = props;
    const iconProps = {};
    let className = '';
    if (iconDisabled) {
        className
            = 'settings-button-small-icon settings-button-small-icon--disabled';
    }
    else {
        className = 'settings-button-small-icon';
        iconProps.onClick = (e) => {
            if (typeof APP !== 'undefined' && notifyMode) {
                APP.API.notifyToolbarButtonClicked(buttonKey, notifyMode === types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY);
            }
            if (notifyMode !== types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY) {
                onIconClick(e);
            }
        };
        iconProps.onKeyDown = onIconKeyDown;
        iconProps.role = 'button';
        iconProps.tabIndex = 0;
        iconProps.ariaControls = ariaControls;
        iconProps.ariaExpanded = ariaExpanded;
        iconProps.containerId = iconId;
    }
    return (react_1.default.createElement("div", { className: 'settings-button-container', style: styles },
        children,
        react_1.default.createElement("div", null,
            react_1.default.createElement(Tooltip_1.default, { containerClassName: className, content: iconTooltip, position: 'top' },
                react_1.default.createElement(Icon_1.default, { ...iconProps, ariaHasPopup: ariaHasPopup, ariaLabel: ariaLabel, size: 16, src: icon })))));
}
exports.default = ToolboxButtonWithIcon;
