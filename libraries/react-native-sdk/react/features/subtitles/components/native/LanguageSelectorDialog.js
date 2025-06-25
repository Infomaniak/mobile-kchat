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
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const AbstractLanguageSelectorDialog_1 = __importDefault(require("../AbstractLanguageSelectorDialog"));
const LanguageList_1 = __importDefault(require("./LanguageList"));
const styles_1 = __importDefault(require("./styles"));
const LanguageSelectorDialog = (props) => {
    const { language, listItems, onLanguageSelected, subtitles } = props;
    const onSelected = (0, react_1.useCallback)((e) => {
        onLanguageSelected(e);
        (0, ConferenceNavigationContainerRef_1.goBack)();
    }, [language]);
    return (<JitsiScreen_1.default disableForcedKeyboardDismiss={true} style={styles_1.default.subtitlesContainer}>
            <LanguageList_1.default items={listItems} onLanguageSelected={onSelected} selectedLanguage={subtitles}/>
        </JitsiScreen_1.default>);
};
/*
 * We apply AbstractLanguageSelector to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
exports.default = (0, AbstractLanguageSelectorDialog_1.default)(LanguageSelectorDialog);
