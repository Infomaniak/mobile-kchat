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
/**
 * Implements a generic Modal (using the built-in Modal component) to share
 * behavior across modals in the app.
 */
class Modal extends react_1.PureComponent {
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        // eslint-disable-next-line react/prop-types
        const { children, ...props } = this.props;
        return (<react_native_1.Modal animationType={'slide'} supportedOrientations={[
                'landscape',
                'portrait'
            ]} transparent={true} {...props}>
                {children}
            </react_native_1.Modal>);
    }
}
exports.default = Modal;
