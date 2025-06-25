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
const react_focus_on_1 = require("react-focus-on");
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../base/ui/functions.web");
const constants_1 = require("../../constants");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        drawerMenuContainer: {
            backgroundColor: 'rgba(0,0,0,0.6)',
            height: '100dvh',
            display: 'flex',
            alignItems: 'flex-end'
        },
        drawer: {
            backgroundColor: theme.palette.ui01,
            maxHeight: `calc(${constants_1.DRAWER_MAX_HEIGHT})`,
            borderRadius: '24px 24px 0 0',
            overflowY: 'auto',
            marginBottom: 'env(safe-area-inset-bottom, 0)',
            width: '100%',
            '& .overflow-menu': {
                margin: 'auto',
                fontSize: '1.2em',
                listStyleType: 'none',
                padding: 0,
                height: 'calc(80vh - 144px - 64px)',
                overflowY: 'auto',
                '& .overflow-menu-item': {
                    boxSizing: 'border-box',
                    height: '48px',
                    padding: '12px 16px',
                    alignItems: 'center',
                    color: theme.palette.text01,
                    cursor: 'pointer',
                    display: 'flex',
                    fontSize: '16px',
                    '& div': {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    },
                    '&.disabled': {
                        cursor: 'initial',
                        color: '#3b475c'
                    }
                }
            }
        }
    };
});
/**
 * Component that displays the mobile friendly drawer on web.
 *
 * @returns {ReactElement}
 */
function Drawer({ children, className = '', headingId, isOpen, onClose }) {
    const { classes, cx } = useStyles();
    /**
     * Handles clicks within the menu, preventing the propagation of the click event.
     *
     * @param {Object} event - The click event.
     * @returns {void}
     */
    const handleInsideClick = (0, react_1.useCallback)(event => {
        event.stopPropagation();
    }, []);
    /**
     * Handles clicks outside of the menu, closing it, and also stopping further propagation.
     *
     * @param {Object} event - The click event.
     * @returns {void}
     */
    const handleOutsideClick = (0, react_1.useCallback)(event => {
        event.stopPropagation();
        onClose?.();
    }, [onClose]);
    /**
     * Handles pressing the escape key, closing the drawer.
     *
     * @param {KeyboardEvent<HTMLDivElement>} event - The keydown event.
     * @returns {void}
     */
    const handleEscKey = (0, react_1.useCallback)((event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            onClose?.();
        }
    }, [onClose]);
    return (isOpen ? (react_1.default.createElement("div", { className: classes.drawerMenuContainer, onClick: handleOutsideClick, onKeyDown: handleEscKey },
        react_1.default.createElement("div", { className: cx(classes.drawer, className), onClick: handleInsideClick },
            react_1.default.createElement(react_focus_on_1.FocusOn, { returnFocus: 
                // If we return the focus to an element outside the viewport the page will scroll to
                // this element which in our case is undesirable and the element is outside of the
                // viewport on purpose (to be hidden). For example if we return the focus to the toolbox
                // when it is hidden the whole page will move up in order to show the toolbox. This is
                // usually followed up with displaying the toolbox (because now it is on focus) but
                // because of the animation the whole scenario looks like jumping large video.
                functions_web_1.isElementInTheViewport },
                react_1.default.createElement("div", { "aria-labelledby": headingId ? `#${headingId}` : undefined, "aria-modal": true, "data-autofocus": true, role: 'dialog', tabIndex: -1 }, children))))) : null);
}
exports.default = Drawer;
