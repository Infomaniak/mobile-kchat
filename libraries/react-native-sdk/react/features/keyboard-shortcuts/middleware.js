"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/config/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_2 = require("../remote-control/actionTypes");
const actions_1 = require("./actions");
MiddlewareRegistry_1.default.register((store) => (next) => (action) => {
    const { dispatch } = store;
    switch (action.type) {
        case actionTypes_2.CAPTURE_EVENTS:
            if (action.isCapturingEvents) {
                dispatch((0, actions_1.disableKeyboardShortcuts)());
            }
            else {
                dispatch((0, actions_1.enableKeyboardShortcuts)());
            }
            return next(action);
        case actionTypes_1.SET_CONFIG: {
            const result = next(action);
            const state = store.getState();
            const { disableShortcuts } = state['features/base/config'];
            if (disableShortcuts !== undefined) {
                if (disableShortcuts) {
                    dispatch((0, actions_1.disableKeyboardShortcuts)());
                }
                else {
                    dispatch((0, actions_1.enableKeyboardShortcuts)());
                }
            }
            return result;
        }
    }
    return next(action);
});
