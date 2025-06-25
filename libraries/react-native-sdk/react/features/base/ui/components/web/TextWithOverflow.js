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
const react_1 = __importStar(require("react"));
const tss_react_1 = require("tss-react");
const mui_1 = require("tss-react/mui");
const constants_web_1 = require("../../constants.web");
const useStyles = (0, mui_1.makeStyles)()((_, { translateDiff }) => {
    return {
        animation: {
            '&:hover': {
                animation: `${(0, tss_react_1.keyframes) `
                    0%, 20% {
                        transform: translateX(0%);
                        left: 0%;
                    }
                    80%, 100% {
                        transform: translateX(-${translateDiff}px);
                        left: 100%;
                    }
                `} ${Math.max(translateDiff * 50, 2000)}ms infinite alternate linear;`
            }
        },
        textContainer: {
            overflow: 'hidden'
        },
        [constants_web_1.TEXT_OVERFLOW_TYPES.ELLIPSIS]: {
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        [constants_web_1.TEXT_OVERFLOW_TYPES.SCROLL_ON_HOVER]: {
            display: 'inline-block',
            overflow: 'visible',
            whiteSpace: 'nowrap'
        }
    };
});
const TextWithOverflow = ({ className, overflowType = constants_web_1.TEXT_OVERFLOW_TYPES.ELLIPSIS, children }) => {
    const containerRef = (0, react_1.useRef)(null);
    const contentRef = (0, react_1.useRef)(null);
    const shouldAnimateOnHover = overflowType === constants_web_1.TEXT_OVERFLOW_TYPES.SCROLL_ON_HOVER
        && containerRef.current
        && contentRef.current
        && containerRef.current.clientWidth < contentRef.current.clientWidth;
    const translateDiff = shouldAnimateOnHover ? contentRef.current.clientWidth - containerRef.current.clientWidth : 0;
    const { classes: styles, cx } = useStyles({ translateDiff });
    return (react_1.default.createElement("div", { className: cx(className, styles.textContainer), ref: containerRef },
        react_1.default.createElement("span", { className: cx(styles[overflowType], shouldAnimateOnHover && styles.animation), ref: contentRef }, children)));
};
exports.default = TextWithOverflow;
