"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../i18n/functions");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const Tooltip_1 = __importDefault(require("../../../tooltip/components/Tooltip"));
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        indicator: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    };
});
/**
 * React {@code Component} for showing an icon with a tooltip.
 *
 * @returns {ReactElement}
 */
const BaseIndicator = ({ className = '', icon, iconClassName, iconColor, iconId, iconSize, id = '', t, tooltipKey, tooltipPosition = 'top' }) => {
    const { classes: styles } = useStyles();
    const style = {};
    if (iconSize) {
        style.fontSize = iconSize;
    }
    return (react_1.default.createElement("div", { className: styles.indicator },
        react_1.default.createElement(Tooltip_1.default, { content: t(tooltipKey), position: tooltipPosition },
            react_1.default.createElement("span", { className: className, id: id },
                react_1.default.createElement(Icon_1.default, { alt: t(tooltipKey), className: iconClassName, color: iconColor, id: iconId, src: icon, style: style })))));
};
exports.default = (0, functions_1.translate)(BaseIndicator);
