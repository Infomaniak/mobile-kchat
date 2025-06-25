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
const react_redux_1 = require("react-redux");
const functions_native_1 = require("../../../base/config/functions.native");
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const constants_native_1 = require("../../../base/ui/constants.native");
const FormSection_1 = __importDefault(require("./FormSection"));
const styles_1 = __importDefault(require("./styles"));
const LinksSection = () => {
    const { privacy, helpCentre, terms } = (0, react_redux_1.useSelector)((state) => (0, functions_native_1.getLegalUrls)(state));
    const links = (0, react_1.useMemo)(() => [
        {
            label: 'settingsView.help',
            link: helpCentre
        },
        {
            label: 'settingsView.terms',
            link: terms
        },
        {
            label: 'settingsView.privacy',
            link: privacy
        }
    ], [privacy, helpCentre, terms]);
    const onLinkPress = (0, react_1.useCallback)(link => () => react_native_1.Linking.openURL(link), [react_native_1.Linking]);
    return (<FormSection_1.default>
            <react_native_1.View style={styles_1.default.linksSection}>
                {links.map(({ label, link }) => (<Button_1.default accessibilityLabel={label} key={label} labelKey={label} onClick={onLinkPress(link)} style={styles_1.default.linksButton} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>))}
            </react_native_1.View>
        </FormSection_1.default>);
};
exports.default = LinksSection;
