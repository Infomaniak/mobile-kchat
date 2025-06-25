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
/* eslint-disable react/jsx-no-bind */
const react_1 = __importStar(require("react"));
const mui_1 = require("tss-react/mui");
const Icon_1 = __importDefault(require("../icons/components/Icon"));
const svg_1 = require("../icons/svg");
const functions_web_1 = require("../styles/functions.web");
const copyText_web_1 = require("../util/copyText.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        copyButton: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBold),
            borderRadius: theme.shape.borderRadius,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
            width: '100%',
            boxSizing: 'border-box',
            background: theme.palette.action01,
            cursor: 'pointer',
            color: theme.palette.text01,
            '&:hover': {
                backgroundColor: theme.palette.action01Hover
            },
            '&.clicked': {
                background: theme.palette.success02
            },
            '& > div > svg': {
                fill: theme.palette.icon01
            }
        },
        content: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 292,
            marginRight: theme.spacing(3),
            '&.selected': {
                fontWeight: 600
            }
        },
        icon: {
            marginRight: theme.spacing(2)
        }
    };
});
let mounted;
/**
 * Component meant to enable users to copy the conference URL.
 *
 * @returns {React$Element<any>}
 */
function CopyButton({ accessibilityText, className = '', displayedText, textToCopy, textOnHover, textOnCopySuccess, id }) {
    const { classes, cx } = useStyles();
    const [isClicked, setIsClicked] = (0, react_1.useState)(false);
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        mounted = true;
        return () => {
            mounted = false;
        };
    }, []);
    /**
     * Click handler for the element.
     *
     * @returns {void}
     */
    async function onClick() {
        setIsHovered(false);
        const isCopied = await (0, copyText_web_1.copyText)(textToCopy);
        if (isCopied) {
            setIsClicked(true);
            setTimeout(() => {
                // avoid: Can't perform a React state update on an unmounted component
                if (mounted) {
                    setIsClicked(false);
                }
            }, 2500);
        }
    }
    /**
     * Hover handler for the element.
     *
     * @returns {void}
     */
    function onHoverIn() {
        if (!isClicked) {
            setIsHovered(true);
        }
    }
    /**
     * Hover handler for the element.
     *
     * @returns {void}
     */
    function onHoverOut() {
        setIsHovered(false);
    }
    /**
     * KeyPress handler for accessibility.
     *
     * @param {React.KeyboardEventHandler<HTMLDivElement>} e - The key event to handle.
     *
     * @returns {void}
     */
    function onKeyPress(e) {
        if (onClick && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            onClick();
        }
    }
    /**
     * Renders the content of the link based on the state.
     *
     * @returns {React$Element<any>}
     */
    function renderContent() {
        if (isClicked) {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(Icon_1.default, { className: classes.icon, size: 24, src: svg_1.IconCheck }),
                react_1.default.createElement("div", { className: cx(classes.content, 'selected') },
                    react_1.default.createElement("span", { role: 'alert' }, textOnCopySuccess))));
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Icon_1.default, { className: classes.icon, size: 24, src: svg_1.IconCopy }),
            react_1.default.createElement("div", { className: classes.content },
                react_1.default.createElement("span", null,
                    " ",
                    isHovered ? textOnHover : displayedText,
                    " "))));
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { "aria-describedby": displayedText === textOnHover
                ? undefined
                : `${id}-sr-text`, "aria-label": displayedText === textOnHover ? accessibilityText : textOnHover, className: cx(className, classes.copyButton, isClicked ? ' clicked' : ''), id: id, onBlur: onHoverOut, onClick: onClick, onFocus: onHoverIn, onKeyPress: onKeyPress, onMouseOut: onHoverOut, onMouseOver: onHoverIn, role: 'button', tabIndex: 0 }, renderContent()),
        displayedText !== textOnHover && (react_1.default.createElement("span", { className: 'sr-only', id: `${id}-sr-text` }, accessibilityText))));
}
exports.default = CopyButton;
