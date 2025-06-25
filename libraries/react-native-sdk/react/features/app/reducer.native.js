"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("../mobile/navigation/actionTypes");
/**
 * Listen for actions which changes the state of the app feature.
 *
 * @param {Object} state - The Redux state of the feature features/app.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @returns {Object}
 */
ReducerRegistry_1.default.register('features/app', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1._ROOT_NAVIGATION_READY:
            return {
                ...state,
                ready: action.ready
            };
        default:
            return state;
    }
});
