"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const functions_1 = require("../base/redux/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Reduces the redux actions of the feature talk while muted.
 */
ReducerRegistry_1.default.register('features/talk-while-muted', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1.SET_CURRENT_NOTIFICATION_UID:
            return (0, functions_1.set)(state, 'currentNotificationUid', action.uid);
    }
    return state;
});
