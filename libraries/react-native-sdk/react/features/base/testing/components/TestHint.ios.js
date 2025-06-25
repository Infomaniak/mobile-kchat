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
const react_redux_1 = require("react-redux");
const AbstractTestHint_1 = require("./AbstractTestHint");
/**
 * This is the iOS version of the TestHint.
 *
 * Be sure to check the description in TestHint.android and AbstractTestHint
 * files to understand what a test hint is and why different iOS and Android
 * components are necessary.
 */
class TestHint extends react_1.Component {
    /**
     *  Renders the test hint on Android.
     *
     * @returns {ReactElement}
     */
    render() {
        if (!this.props._testModeEnabled) {
            return null;
        }
        return (react_1.default.createElement(react_native_1.Text, { accessibilityLabel: this.props.value, onPress: this.props.onPress, testID: this.props.id }));
    }
}
exports.default = (0, react_redux_1.connect)(AbstractTestHint_1._mapStateToProps)(TestHint);
