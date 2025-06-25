"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Link_1 = __importDefault(require("../react/components/native/Link"));
const BaseTheme_native_1 = __importDefault(require("../ui/components/BaseTheme.native"));
const contants_1 = require("./contants");
/**
 * Gets the unsafe room text for the given context.
 *
 * @param {IReduxState} state - The redux state.
 * @param {Function} t - The translation function.
 * @param {'meeting'|'prejoin'|'welcome'} context - The given context of the warining.
 * @returns {Text}
 */
function getUnsafeRoomText(state, t, context) {
    const securityUrl = state['features/base/config'].legalUrls?.security ?? contants_1.SECURITY_URL;
    const link = react_1.default.createElement(Link_1.default, {
        url: securityUrl,
        children: 'here',
        key: 'support-link',
        style: { color: BaseTheme_native_1.default.palette.action01 }
    });
    const options = {
        recommendAction: t(`security.unsafeRoomActions.${context}`)
    };
    return react_1.default.createElement(react_native_1.Text, { children: [t('security.insecureRoomNameWarningNative', options), link, '.'] });
}
exports.default = getUnsafeRoomText;
