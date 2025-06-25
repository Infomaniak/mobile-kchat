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
const react_native_paper_1 = require("react-native-paper");
const functions_1 = require("../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const styles_1 = __importDefault(require("./styles"));
/**
 * Component that renders the language list item.
 *
 * @returns {React$Element<any>}
 */
const LanguageListItem = ({ t, lang, selected, onLanguageSelected }) => {
    const onLanguageSelectedWrapper = (0, react_1.useCallback)(() => onLanguageSelected(lang), [lang]);
    return (<react_native_1.View style={styles_1.default.languageItemWrapper}>
            <react_native_1.View style={styles_1.default.iconWrapper}>
                {selected
            && <Icon_1.default size={20} src={svg_1.IconCheck}/>}
            </react_native_1.View>
            <react_native_1.TouchableHighlight onPress={onLanguageSelectedWrapper} underlayColor={'transparent'}>
                <react_native_paper_1.Text style={[
            styles_1.default.languageItemText,
            selected && styles_1.default.activeLanguageItemText
        ]}>
                    {t(lang)}
                </react_native_paper_1.Text>
            </react_native_1.TouchableHighlight>
        </react_native_1.View>);
};
exports.default = (0, functions_1.translate)(LanguageListItem);
