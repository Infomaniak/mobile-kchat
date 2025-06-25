"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
/**
 * The default/initial redux state of the feature background.
 */
const DEFAULT_STATE = {
    appState: 'active'
};
ReducerRegistry_1.default.register('features/background', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1._SET_APP_STATE_SUBSCRIPTION:
            return {
                ...state,
                subscription: action.subscription
            };
        case actionTypes_1.APP_STATE_CHANGED:
            return {
                ...state,
                appState: action.appState
            };
    }
    return state;
});
