"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = __importDefault(require("react-dom"));
const react_redux_1 = require("react-redux");
const constants_1 = require("../../constants");
/**
 * Component meant to render a drawer at the bottom of the screen,
 * by creating a portal containing the component's children.
 *
 * @returns {ReactElement}
 */
function DialogPortal({ children, className, style, getRef, setSize, targetSelector, onVisible }) {
    const clientWidth = (0, react_redux_1.useSelector)((state) => state['features/base/responsive-ui'].clientWidth);
    const [portalTarget] = (0, react_1.useState)(() => {
        const portalDiv = document.createElement('div');
        portalDiv.style.visibility = 'hidden';
        return portalDiv;
    });
    const timerRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        if (style) {
            for (const styleProp of Object.keys(style)) {
                const objStyle = portalTarget.style;
                objStyle[styleProp] = style[styleProp];
            }
        }
        if (className) {
            portalTarget.className = className;
        }
    }, [style, className]);
    (0, react_1.useEffect)(() => {
        if (portalTarget && getRef) {
            getRef(portalTarget);
            portalTarget.style.zIndex = `${constants_1.ZINDEX_DIALOG_PORTAL}`;
        }
    }, [portalTarget, getRef]);
    (0, react_1.useEffect)(() => {
        const size = {
            width: 1,
            height: 1
        };
        const observer = new ResizeObserver(entries => {
            const { contentRect } = entries[0];
            if (contentRect.width !== size.width || contentRect.height !== size.height) {
                setSize?.(contentRect);
                clearTimeout(timerRef.current);
                timerRef.current = window.setTimeout(() => {
                    portalTarget.style.visibility = 'visible';
                    onVisible?.();
                }, 100);
            }
        });
        const target = targetSelector ? portalTarget.querySelector(targetSelector) : portalTarget;
        if (document.body) {
            document.body.appendChild(portalTarget);
            observer.observe(target ?? portalTarget);
        }
        return () => {
            observer.unobserve(target ?? portalTarget);
            if (document.body) {
                document.body.removeChild(portalTarget);
            }
        };
    }, [clientWidth]);
    return react_dom_1.default.createPortal(children, portalTarget);
}
exports.default = DialogPortal;
