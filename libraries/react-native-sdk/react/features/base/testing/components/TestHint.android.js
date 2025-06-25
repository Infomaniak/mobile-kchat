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
 * The Android version of <code>TestHint</code>. It will put the identifier,
 * as the 'accessibilityLabel'.
 *
 * FIXME The 'testID' attribute (which is used on iOS) does not work with
 * the react-native as expected, because is mapped to component's tag instead of
 * any attribute visible to the UI automation. Because of that it can not be
 * used to find the element.
 * On the other hand it's not possible to use 'accessibilityLabel' on the iOS
 * for the id purpose, because it will merge the value with any text content or
 * 'accessibilityLabel' values of it's children. So as a workaround a TestHint
 * class was introduced in 'jitsi-meet-torture' which will accept generic 'id'
 * attribute and then do the search 'under the hood' either by the accessibility
 * label or the id, depending on the participant's platform. On the client side
 * the TestHint class is to be the abstraction layer which masks the problem by
 * exposing id and value properties.
 */
class TestHint extends react_1.Component {
    /**
     * Renders the test hint on Android.
     *
     * @returns {ReactElement}
     */
    render() {
        if (!this.props._testModeEnabled) {
            return null;
        }
        return (react_1.default.createElement(react_native_1.Text, { accessibilityLabel: this.props.id, onPress: this.props.onPress }, this.props.value));
    }
}
exports.default = (0, react_redux_1.connect)(AbstractTestHint_1._mapStateToProps)(TestHint);
