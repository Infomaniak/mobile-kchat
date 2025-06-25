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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SIZE = exports.DEFAULT_COLOR = void 0;
const react_1 = __importStar(require("react"));
const index_1 = require("../../react/components/index");
const functions_1 = require("../../styles/functions");
exports.DEFAULT_COLOR = navigator.product === 'ReactNative' ? 'white' : undefined;
exports.DEFAULT_SIZE = navigator.product === 'ReactNative' ? 36 : 22;
/**
 * Implements an Icon component that takes a loaded SVG file as prop and renders it as an icon.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactElement}
 */
function Icon(props) {
    const { alt, className, color, id, containerId, onClick, size, src: IconComponent, style, ariaHasPopup, ariaLabel, ariaDisabled, ariaExpanded, ariaControls, tabIndex, ariaPressed, ariaDescribedBy, role, onKeyPress, onKeyDown, testId, ...rest } = props;
    const { color: styleColor, fontSize: styleSize, ...restStyle } = (0, functions_1.styleTypeToObject)(style ?? {});
    const calculatedColor = color ?? styleColor ?? exports.DEFAULT_COLOR;
    const calculatedSize = size ?? styleSize ?? exports.DEFAULT_SIZE;
    const onKeyPressHandler = (0, react_1.useCallback)(e => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            onClick(e);
        }
        else if (onKeyPress) {
            onKeyPress(e);
        }
    }, [onClick, onKeyPress]);
    const jitsiIconClassName = calculatedColor ? 'jitsi-icon' : 'jitsi-icon jitsi-icon-default';
    const iconProps = alt ? {
        'aria-label': alt,
        role: 'img'
    } : {
        'aria-hidden': true
    };
    return (react_1.default.createElement(index_1.Container, { ...rest, "aria-controls": ariaControls, "aria-describedby": ariaDescribedBy, "aria-disabled": ariaDisabled, "aria-expanded": ariaExpanded, "aria-haspopup": ariaHasPopup, "aria-label": ariaLabel, "aria-pressed": ariaPressed, className: `${jitsiIconClassName} ${className || ''}`, "data-testid": testId, id: containerId, onClick: onClick, onKeyDown: onKeyDown, onKeyPress: onKeyPressHandler, role: role, style: restStyle, tabIndex: tabIndex },
        react_1.default.createElement(IconComponent, { ...iconProps, fill: calculatedColor, height: calculatedSize, id: id, width: calculatedSize })));
}
exports.default = Icon;
Icon.defaultProps = {
    className: ''
};
