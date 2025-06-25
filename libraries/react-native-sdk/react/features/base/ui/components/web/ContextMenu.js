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
const react_focus_on_1 = require("react-focus-on");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const Drawer_1 = __importDefault(require("../../../../toolbox/components/web/Drawer"));
const JitsiPortal_1 = __importDefault(require("../../../../toolbox/components/web/JitsiPortal"));
const functions_web_1 = require("../../../../toolbox/functions.web");
const participantsPaneTheme_json_1 = __importDefault(require("../../../components/themes/participantsPaneTheme.json"));
const functions_web_2 = require("../../../styles/functions.web");
const Tokens_1 = require("../../Tokens");
/**
 * Get a style property from a style declaration as a float.
 *
 * @param {CSSStyleDeclaration} styles - Style declaration.
 * @param {string} name - Property name.
 * @returns {number} Float value.
 */
const getFloatStyleProperty = (styles, name) => parseFloat(styles.getPropertyValue(name));
/**
* Gets the outer height of an element, including margins.
*
* @param {Element} element - Target element.
* @returns {number} Computed height.
*/
const getComputedOuterHeight = (element) => {
    const computedStyle = getComputedStyle(element);
    return element.offsetHeight
        + getFloatStyleProperty(computedStyle, 'margin-top')
        + getFloatStyleProperty(computedStyle, 'margin-bottom');
};
const MAX_HEIGHT = 400;
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        contextMenu: {
            backgroundColor: theme.palette.ui01,
            border: `1px solid ${theme.palette.ui04}`,
            borderRadius: `${Number(theme.shape.borderRadius)}px`,
            boxShadow: '0px 1px 2px rgba(41, 41, 41, 0.25)',
            color: theme.palette.text01,
            ...(0, functions_web_2.withPixelLineHeight)(theme.typography.bodyShortRegular),
            marginTop: '48px',
            position: 'absolute',
            right: `${participantsPaneTheme_json_1.default.panePadding}px`,
            top: 0,
            zIndex: 2,
            maxHeight: `${MAX_HEIGHT}px`,
            overflowY: 'auto',
            padding: `${theme.spacing(2)} 0`
        },
        contextMenuHidden: {
            pointerEvents: 'none',
            visibility: 'hidden'
        },
        drawer: {
            paddingTop: '16px',
            '& > div': {
                ...(0, functions_web_2.withPixelLineHeight)(theme.typography.bodyShortRegularLarge),
                '& svg': {
                    fill: theme.palette.icon01
                }
            }
        }
    };
});
const ContextMenu = ({ accessibilityLabel, activateFocusTrap = false, children, className, entity, hidden, id, inDrawer, isDrawerOpen, offsetTarget, onClick, onKeyDown, onDrawerClose, onMouseEnter, onMouseLeave, role, tabIndex, ...aria }) => {
    const [isHidden, setIsHidden] = (0, react_1.useState)(true);
    const containerRef = (0, react_1.useRef)(null);
    const { classes: styles, cx } = useStyles();
    const _overflowDrawer = (0, react_redux_1.useSelector)(functions_web_1.showOverflowDrawer);
    (0, react_1.useLayoutEffect)(() => {
        if (_overflowDrawer) {
            return;
        }
        if (entity && offsetTarget
            && containerRef.current
            && offsetTarget?.offsetParent
            && offsetTarget.offsetParent instanceof HTMLElement) {
            const { current: container } = containerRef;
            // make sure the max height is not set
            container.style.maxHeight = 'none';
            const { offsetTop, offsetParent: { offsetHeight, scrollTop } } = offsetTarget;
            let outerHeight = getComputedOuterHeight(container);
            let height = Math.min(MAX_HEIGHT, outerHeight);
            if (offsetTop + height > offsetHeight + scrollTop && height > offsetTop) {
                // top offset and + padding + border
                container.style.maxHeight = `${offsetTop - ((Tokens_1.spacing[2] * 2) + 2)}px`;
            }
            // get the height after style changes
            outerHeight = getComputedOuterHeight(container);
            height = Math.min(MAX_HEIGHT, outerHeight);
            container.style.top = offsetTop + height > offsetHeight + scrollTop
                ? `${offsetTop - outerHeight}`
                : `${offsetTop}`;
            setIsHidden(false);
        }
        else {
            hidden === undefined && setIsHidden(true);
        }
    }, [entity, offsetTarget, _overflowDrawer]);
    (0, react_1.useEffect)(() => {
        if (hidden !== undefined) {
            setIsHidden(hidden);
        }
    }, [hidden]);
    const handleKeyDown = (0, react_1.useCallback)((event) => {
        const { current: listRef } = containerRef;
        const currentFocusElement = document.activeElement;
        const moveFocus = (list, currentFocus, traversalFunction) => {
            let wrappedOnce = false;
            let nextFocus = traversalFunction(list, currentFocus);
            /* eslint-disable no-unmodified-loop-condition */
            while (list && nextFocus) {
                // Prevent infinite loop.
                if (nextFocus === list.firstChild) {
                    if (wrappedOnce) {
                        return;
                    }
                    wrappedOnce = true;
                }
                // Same logic as useAutocomplete.js
                const nextFocusDisabled 
                /* eslint-disable no-extra-parens */
                = nextFocus.disabled
                    || nextFocus.getAttribute('aria-disabled') === 'true';
                if (!nextFocus.hasAttribute('tabindex') || nextFocusDisabled) {
                    // Move to the next element.
                    nextFocus = traversalFunction(list, nextFocus);
                }
                else {
                    /* eslint-disable no-extra-parens */
                    nextFocus.focus();
                    return;
                }
            }
        };
        const previousItem = (list, item) => {
            /**
            * To find the last child of the list.
            *
            * @param {Element | null} element - Element.
            * @returns {Element | null}
            */
            function lastChild(element) {
                while (element?.lastElementChild) {
                    /* eslint-disable no-param-reassign */
                    element = element.lastElementChild;
                }
                return element;
            }
            if (!list) {
                return null;
            }
            if (list === item) {
                return list.lastElementChild;
            }
            if (item?.previousElementSibling) {
                return lastChild(item.previousElementSibling);
            }
            if (item && item?.parentElement !== list) {
                return item.parentElement;
            }
            return lastChild(list.lastElementChild);
        };
        const nextItem = (list, item) => {
            if (!list) {
                return null;
            }
            if (list === item) {
                return list.firstElementChild;
            }
            if (item?.firstElementChild) {
                return item.firstElementChild;
            }
            if (item?.nextElementSibling) {
                return item.nextElementSibling;
            }
            while (item && item.parentElement !== list) {
                /* eslint-disable no-param-reassign */
                item = item.parentElement;
                if (item?.nextElementSibling) {
                    return item.nextElementSibling;
                }
            }
            return list?.firstElementChild;
        };
        if (event.key === 'Escape') {
            // Close the menu
            setIsHidden(true);
        }
        else if (event.key === 'ArrowUp') {
            // Move focus to the previous menu item
            event.preventDefault();
            moveFocus(listRef, currentFocusElement, previousItem);
        }
        else if (event.key === 'ArrowDown') {
            // Move focus to the next menu item
            event.preventDefault();
            moveFocus(listRef, currentFocusElement, nextItem);
        }
    }, [containerRef]);
    const removeFocus = (0, react_1.useCallback)(() => {
        onDrawerClose?.();
    }, [onMouseLeave]);
    if (_overflowDrawer && inDrawer) {
        return (react_1.default.createElement("div", { className: styles.drawer, onClick: onDrawerClose }, children));
    }
    return _overflowDrawer
        ? react_1.default.createElement(JitsiPortal_1.default, null,
            react_1.default.createElement(Drawer_1.default, { isOpen: Boolean(isDrawerOpen && _overflowDrawer), onClose: onDrawerClose },
                react_1.default.createElement("div", { className: styles.drawer, onClick: onDrawerClose }, children)))
        : react_1.default.createElement(react_focus_on_1.FocusOn
        // Use the `enabled` prop instead of conditionally rendering ReactFocusOn
        // to prevent UI stutter on dialog appearance. It seems the focus guards generated annoy
        // our DialogPortal positioning calculations.
        , { 
            // Use the `enabled` prop instead of conditionally rendering ReactFocusOn
            // to prevent UI stutter on dialog appearance. It seems the focus guards generated annoy
            // our DialogPortal positioning calculations.
            enabled: activateFocusTrap && !isHidden, onClickOutside: removeFocus, onEscapeKey: removeFocus },
            react_1.default.createElement("div", { ...aria, "aria-label": accessibilityLabel, className: cx(styles.contextMenu, isHidden && styles.contextMenuHidden, className), id: id, onClick: onClick, onKeyDown: onKeyDown ?? handleKeyDown, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, ref: containerRef, role: role, tabIndex: tabIndex }, children));
};
exports.default = ContextMenu;
