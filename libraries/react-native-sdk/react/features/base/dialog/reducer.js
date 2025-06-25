"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const functions_1 = require("../redux/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Reduces redux actions which show or hide dialogs.
 *
 * @param {IDialogState} state - The current redux state.
 * @param {Action} action - The redux action to reduce.
 * @param {string} action.type - The type of the redux action to reduce..
 * @returns {State} The next redux state that is the result of reducing the
 * specified action.
 */
ReducerRegistry_1.default.register('features/base/dialog', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1.HIDE_DIALOG: {
            const { component } = action;
            if (typeof component === 'undefined' || state.component === component) {
                return (0, functions_1.assign)(state, {
                    component: undefined,
                    componentProps: undefined
                });
            }
            break;
        }
        case actionTypes_1.OPEN_DIALOG:
            return (0, functions_1.assign)(state, {
                component: action.component,
                componentProps: action.componentProps
            });
        case actionTypes_1.HIDE_SHEET:
            return (0, functions_1.assign)(state, {
                sheet: undefined,
                sheetProps: undefined
            });
        case actionTypes_1.OPEN_SHEET:
            return (0, functions_1.assign)(state, {
                sheet: action.component,
                sheetProps: action.componentProps
            });
    }
    return state;
});
