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
const utils_1 = require("../../../base/environment/utils");
/**
 * Component that renders an element to lift the chat input above the Safari keyboard,
 * computing the appropriate height comparisons based on the {@code visualViewport}.
 *
 * @returns {ReactElement}
 */
function KeyboardAvoider() {
    if (!(0, utils_1.isIosMobileBrowser)()) {
        return null;
    }
    const [elementHeight, setElementHeight] = (0, react_1.useState)(0);
    const [storedHeight, setStoredHeight] = (0, react_1.useState)(window.innerHeight);
    /**
     * Handles the resizing of the visual viewport in order to compute
     * the {@code KeyboardAvoider}'s height.
     *
     * @returns {void}
     */
    function handleViewportResize() {
        const { innerWidth, visualViewport } = window;
        const { width, height } = visualViewport ?? {};
        // Compare the widths to make sure the {@code visualViewport} didn't resize due to zooming.
        if (width === innerWidth) {
            if (Number(height) < storedHeight) {
                setElementHeight(storedHeight - Number(height));
            }
            else {
                setElementHeight(0);
            }
            setStoredHeight(Number(height));
        }
    }
    (0, react_1.useEffect)(() => {
        // Call the handler in case the keyboard is open when the {@code KeyboardAvoider} is mounted.
        handleViewportResize();
        window.visualViewport?.addEventListener('resize', handleViewportResize);
        return () => {
            window.visualViewport?.removeEventListener('resize', handleViewportResize);
        };
    }, []);
    return react_1.default.createElement("div", { style: { height: `${elementHeight}px` } });
}
exports.default = KeyboardAvoider;
