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
exports.DialogTransitionContext = void 0;
const react_1 = __importStar(require("react"));
exports.DialogTransitionContext = react_1.default.createContext({ isUnmounting: false });
const DialogTransition = ({ children }) => {
    const [childrenToRender, setChildrenToRender] = (0, react_1.useState)(children);
    const [isUnmounting, setIsUnmounting] = (0, react_1.useState)(false);
    const [timeoutID, setTimeoutID] = (0, react_1.useState)(undefined);
    (0, react_1.useEffect)(() => {
        if (children === null) {
            setIsUnmounting(true);
            if (typeof timeoutID === 'undefined') {
                setTimeoutID(setTimeout(() => {
                    setChildrenToRender(children);
                    setIsUnmounting(false);
                    setTimeoutID(undefined);
                }, 150));
            }
        }
        else {
            if (typeof timeoutID !== 'undefined') {
                clearTimeout(timeoutID);
                setTimeoutID(undefined);
                setIsUnmounting(false);
            }
            setChildrenToRender(children);
        }
    }, [children]);
    return (react_1.default.createElement(exports.DialogTransitionContext.Provider, { value: { isUnmounting } }, childrenToRender));
};
exports.default = DialogTransition;
