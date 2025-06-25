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
const ColorPalette_1 = require("../../../styles/components/styles/ColorPalette");
/**
 * An animated, large react-native {@link ActivityIndicator} which is considered
 * a suitable visualization of long-running processes with indeterminate amounts
 * of work to be done.
 */
class LoadingIndicator extends react_1.PureComponent {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { color = ColorPalette_1.ColorPalette.white } = this.props;
        let { size = 'large' } = this.props;
        if (size === 'medium') {
            size = 'large';
        }
        const props = {
            color,
            ...this.props,
            size
        };
        return (<react_native_1.ActivityIndicator animating={true} {...props} size={size}/>);
    }
}
exports.default = LoadingIndicator;
