"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const functions_1 = require("../base/redux/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Reduces the redux actions of the feature overlay.
 *
 * FIXME: these pieces of state should probably be in a different place.
 */
ReducerRegistry_1.default.register('features/overlay', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1.MEDIA_PERMISSION_PROMPT_VISIBILITY_CHANGED:
            return _mediaPermissionPromptVisibilityChanged(state, action);
    }
    return state;
});
/**
 * Reduces a specific redux action MEDIA_PERMISSION_PROMPT_VISIBILITY_CHANGED of
 * the feature overlay.
 *
 * @param {Object} state - The redux state of the feature overlay.
 * @param {Action} action - The redux action to reduce.
 * @private
 * @returns {Object} The new state of the feature overlay after the reduction of
 * the specified action.
 */
function _mediaPermissionPromptVisibilityChanged(state, { browser, isVisible }) {
    return (0, functions_1.assign)(state, {
        browser,
        isMediaPermissionPromptVisible: isVisible
    });
}
