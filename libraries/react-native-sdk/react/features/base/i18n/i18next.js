"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSLATION_LANGUAGES_HEAD = exports.DEFAULT_LANGUAGE = exports.TRANSLATION_LANGUAGES = exports.LANGUAGES = void 0;
const en_json_1 = __importDefault(require("i18n-iso-countries/langs/en.json"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_http_backend_1 = __importDefault(require("i18next-http-backend"));
const lodash_1 = __importDefault(require("lodash"));
const languages_json_1 = __importDefault(require("../../../../lang/languages.json"));
const main_json_1 = __importDefault(require("../../../../lang/main.json"));
const translation_languages_json_1 = __importDefault(require("../../../../lang/translation-languages.json"));
const actionTypes_1 = require("./actionTypes");
const languageDetector_1 = __importDefault(require("./languageDetector"));
/**
 * Override certain country names.
 */
const COUNTRIES_RESOURCES_OVERRIDES = {
    countries: {
        TW: 'Taiwan'
    }
};
/**
 * Merged country names.
 */
const COUNTRIES = lodash_1.default.merge({}, en_json_1.default, COUNTRIES_RESOURCES_OVERRIDES);
/**
 * The available/supported languages.
 *
 * @public
 * @type {Array<string>}
 */
exports.LANGUAGES = Object.keys(languages_json_1.default);
/**
 * The available/supported translation languages.
 *
 * @public
 * @type {Array<string>}
 */
exports.TRANSLATION_LANGUAGES = Object.keys(translation_languages_json_1.default);
/**
 * The default language.
 *
 * English is the default language.
 *
 * @public
 * @type {string} The default language.
 */
exports.DEFAULT_LANGUAGE = 'en';
/**
 * The available/supported translation languages head. (Languages displayed on the top ).
 *
 * @public
 * @type {Array<string>}
 */
exports.TRANSLATION_LANGUAGES_HEAD = [exports.DEFAULT_LANGUAGE];
/**
 * The options to initialize i18next with.
 *
 * @type {i18next.InitOptions}
 */
const options = {
    backend: {
        loadPath: (lng, ns) => {
            switch (ns[0]) {
                case 'countries':
                case 'main':
                    return 'lang/{{ns}}-{{lng}}.json';
                default:
                    return 'lang/{{ns}}.json';
            }
        }
    },
    defaultNS: 'main',
    fallbackLng: exports.DEFAULT_LANGUAGE,
    interpolation: {
        escapeValue: false // not needed for react as it escapes by default
    },
    load: 'languageOnly',
    ns: ['main', 'languages', 'countries', 'translation-languages'],
    react: {
        // re-render when a new resource bundle is added
        // @ts-expect-error. Fixed in i18next 19.6.1.
        bindI18nStore: 'added',
        useSuspense: false
    },
    returnEmptyString: false,
    returnNull: false,
    // XXX i18next modifies the array lngWhitelist so make sure to clone
    // LANGUAGES.
    whitelist: exports.LANGUAGES.slice()
};
i18next_1.default
    .use(navigator.product === 'ReactNative' ? {} : i18next_http_backend_1.default)
    .use(languageDetector_1.default)
    .init(options);
// Add default language which is preloaded from the source code.
i18next_1.default.addResourceBundle(exports.DEFAULT_LANGUAGE, 'countries', COUNTRIES, 
/* deep */ true, 
/* overwrite */ true);
i18next_1.default.addResourceBundle(exports.DEFAULT_LANGUAGE, 'languages', languages_json_1.default, 
/* deep */ true, 
/* overwrite */ true);
i18next_1.default.addResourceBundle(exports.DEFAULT_LANGUAGE, 'translation-languages', translation_languages_json_1.default, 
/* deep */ true, 
/* overwrite */ true);
i18next_1.default.addResourceBundle(exports.DEFAULT_LANGUAGE, 'main', main_json_1.default, 
/* deep */ true, 
/* overwrite */ true);
// Add builtin languages.
// XXX: Note we are using require here, because we want the side-effects of the
// import, but imports can only be placed at the top, and it would be too early,
// since i18next is not yet initialized at that point.
require('./BuiltinLanguages');
// Label change through dynamic branding is available only for web
if (typeof APP !== 'undefined') {
    i18next_1.default.on('initialized', () => {
        APP.store.dispatch({ type: actionTypes_1.I18NEXT_INITIALIZED });
    });
    i18next_1.default.on('languageChanged', () => {
        APP.store.dispatch({ type: actionTypes_1.LANGUAGE_CHANGED });
    });
}
exports.default = i18next_1.default;
