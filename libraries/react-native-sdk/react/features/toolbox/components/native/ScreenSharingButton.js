"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_native_1 = require("../../functions.native");
const ScreenSharingAndroidButton_1 = __importDefault(require("./ScreenSharingAndroidButton"));
const ScreenSharingIosButton_1 = __importDefault(require("./ScreenSharingIosButton"));
const ScreenSharingButton = (props) => (<>
        {react_native_1.Platform.OS === 'android'
        && <ScreenSharingAndroidButton_1.default {...props}/>}
        {react_native_1.Platform.OS === 'ios'
        && <ScreenSharingIosButton_1.default {...props}/>}
    </>);
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code ScreenSharingButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Object}
 */
function _mapStateToProps(state) {
    return {
        _disabled: (0, functions_native_1.isDesktopShareButtonDisabled)(state)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(ScreenSharingButton);
