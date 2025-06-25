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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const functions_1 = require("../../base/i18n/functions");
const Button_1 = __importDefault(require("../../base/ui/components/native/Button"));
const constants_native_1 = require("../../base/ui/constants.native");
const styles_1 = __importDefault(require("./styles"));
// eslint-disable-next-line
const GOOGLE_BRAND_IMAGE = require('../../../../images/btn_google_signin_dark_normal.png');
/**
 * A React Component showing a button to sign in with Google.
 *
 * @augments Component
 */
class GoogleSignInButton extends react_1.Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { onClick, signedIn } = this.props;
        if (signedIn) {
            return (<Button_1.default accessibilityLabel='liveStreaming.signOut' labelKey='liveStreaming.signOut' onClick={onClick} style={styles_1.default.signOutButton} type={constants_native_1.BUTTON_TYPES.SECONDARY}/>);
        }
        return (<react_native_1.TouchableOpacity onPress={onClick} style={styles_1.default.signInButton}>
                <react_native_1.Image resizeMode={'contain'} source={GOOGLE_BRAND_IMAGE} style={styles_1.default.signInImage}/>
            </react_native_1.TouchableOpacity>);
    }
}
exports.default = (0, functions_1.translate)(GoogleSignInButton);
