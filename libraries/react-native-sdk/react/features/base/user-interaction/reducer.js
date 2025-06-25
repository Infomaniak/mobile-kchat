"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../app/actionTypes");
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const actionTypes_2 = require("./actionTypes");
ReducerRegistry_1.default.register('features/base/user-interaction', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
        case actionTypes_1.APP_WILL_UNMOUNT:
            return {
                ...state,
                interacted: false
            };
        case actionTypes_2.USER_INTERACTION_RECEIVED:
            return {
                ...state,
                interacted: true
            };
    }
    return state;
});
