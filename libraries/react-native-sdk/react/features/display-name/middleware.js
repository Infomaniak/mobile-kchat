"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../base/dialog/actions");
const functions_1 = require("../base/dialog/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_1 = require("../base/settings/actionTypes");
const components_1 = require("./components");
/**
 * Middleware that captures actions related to display name setting.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => next => action => {
    switch (action.type) {
        case actionTypes_1.SETTINGS_UPDATED: {
            if (action.settings.displayName
                && (0, functions_1.isDialogOpen)(getState, components_1.DisplayNamePrompt)) {
                dispatch((0, actions_1.hideDialog)(components_1.DisplayNamePrompt));
            }
        }
    }
    return next(action);
});
