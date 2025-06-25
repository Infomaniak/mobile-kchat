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
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
/**
 * A {@link View} which captures the 'onLayout' event and calls a prop with the
 * component size.
 *
 * @param {IProps} props - The read-only properties with which the new
 * instance is to be initialized.
 * @returns {Component} - Renders the root view and it's children.
 */
function DimensionsDetector(props) {
    const { top = 0, right = 0, bottom = 0, left = 0 } = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    const { children, onDimensionsChanged, onSafeAreaInsetsChanged } = props;
    (0, react_1.useEffect)(() => {
        onSafeAreaInsetsChanged?.({
            top,
            right,
            bottom,
            left
        });
    }, [onSafeAreaInsetsChanged, top, right, bottom, left]);
    /**
     * Handles the "on layout" View's event and calls the onDimensionsChanged
     * prop.
     *
     * @param {Object} event - The "on layout" event object/structure passed
     * by react-native.
     * @private
     * @returns {void}
     */
    const onLayout = (0, react_1.useCallback)(({ nativeEvent: { layout: { height, width } } }) => {
        onDimensionsChanged?.(width, height);
    }, [onDimensionsChanged]);
    return (<react_native_1.View onLayout={onLayout} style={react_native_1.StyleSheet.absoluteFillObject}>
            {children}
        </react_native_1.View>);
}
exports.default = DimensionsDetector;
