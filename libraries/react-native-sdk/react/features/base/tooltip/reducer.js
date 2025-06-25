"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const DEFAULT_STATE = {
    content: '',
    previousContent: '',
    visible: false
};
/**
 * Reduces redux actions which mark the tooltip as displayed or hidden.
 *
 * @param {IDialogState} state - The current redux state.
 * @param {Action} action - The redux action to reduce.
 * @param {string} action.type - The type of the redux action to reduce..
 * @returns {State} The next redux state that is the result of reducing the
 * specified action.
 */
ReducerRegistry_1.default.register('features/base/tooltip', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SHOW_TOOLTIP:
            return {
                content: action.content,
                previousContent: state.content,
                visible: true
            };
        case actionTypes_1.HIDE_TOOLTIP: {
            // The tooltip can be marked as hidden only if the hide action
            // is dispatched by the tooltip that is displayed.
            if (action.content === state.content) {
                return {
                    content: '',
                    previousContent: '',
                    visible: false
                };
            }
            return state;
        }
    }
    return state;
});
