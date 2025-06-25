"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../../dynamic-branding/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actionTypes_2 = require("./actionTypes");
const functions_1 = require("./functions");
const i18next_1 = __importDefault(require("./i18next"));
const logger_1 = __importDefault(require("./logger"));
/**
 * Implements the entry point of the middleware of the feature base/i18n.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => async (action) => {
    switch (action.type) {
        case actionTypes_2.I18NEXT_INITIALIZED:
        case actionTypes_2.LANGUAGE_CHANGED:
        case actionTypes_1.SET_DYNAMIC_BRANDING_DATA: {
            const { language } = i18next_1.default;
            const { labels } = action.type === actionTypes_1.SET_DYNAMIC_BRANDING_DATA
                ? action.value
                : store.getState()['features/dynamic-branding'];
            if (language && labels && labels[language]) {
                try {
                    await (0, functions_1.changeLanguageBundle)(language, labels[language]);
                }
                catch (err) {
                    logger_1.default.log('Error setting dynamic language bundle', err);
                }
            }
            break;
        }
    }
    return next(action);
});
