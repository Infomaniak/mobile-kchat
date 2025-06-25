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
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const i18next_1 = require("../../base/i18n/i18next");
const actions_any_1 = require("../actions.any");
/**
 * Higher Order Component taking in a concrete LanguageSelector component and
 * augmenting it with state/behavior common to both web and native implementations.
 *
 * @param {React.Component} Component - The concrete component.
 * @returns {React.Component}
 */
const AbstractLanguageSelectorDialog = (Component) => () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const noLanguageLabel = 'transcribing.subtitlesOff';
    const language = (0, react_redux_1.useSelector)((state) => state['features/subtitles']._language);
    const subtitles = language ?? noLanguageLabel;
    const transcription = (0, react_redux_1.useSelector)((state) => state['features/base/config'].transcription);
    const translationLanguagesHead = transcription?.translationLanguagesHead ?? i18next_1.TRANSLATION_LANGUAGES_HEAD;
    const languagesHead = translationLanguagesHead?.map((lang) => `translation-languages:${lang}`);
    // The off and the head languages are always on the top of the list. But once you are selecting
    // a language from the translationLanguages, that language is moved under the fixedItems list,
    // until a new languages is selected. FixedItems keep their positions.
    const fixedItems = [noLanguageLabel, ...languagesHead];
    const translationLanguages = transcription?.translationLanguages ?? i18next_1.TRANSLATION_LANGUAGES;
    const languages = translationLanguages
        .map((lang) => `translation-languages:${lang}`)
        .filter((lang) => !(lang === subtitles || languagesHead?.includes(lang)));
    const listItems = (fixedItems?.includes(subtitles)
        ? [...fixedItems, ...languages]
        : [...fixedItems, subtitles, ...languages])
        .map((lang, index) => {
        return {
            id: lang + index,
            lang,
            selected: lang === subtitles
        };
    });
    const onLanguageSelected = (0, react_1.useCallback)((value) => {
        const selectedLanguage = value === noLanguageLabel ? null : value;
        const enabled = Boolean(selectedLanguage);
        const displaySubtitles = enabled;
        dispatch((0, actions_any_1.setRequestingSubtitles)(enabled, displaySubtitles, selectedLanguage));
    }, [language]);
    return (react_1.default.createElement(Component, { dispatch: dispatch, language: language, listItems: listItems, onLanguageSelected: onLanguageSelected, subtitles: subtitles, t: t }));
};
exports.default = AbstractLanguageSelectorDialog;
