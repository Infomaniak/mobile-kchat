"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
ReducerRegistry_1.default.register('features/base/lastn', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1.SET_LAST_N: {
            const { lastN } = action;
            return {
                ...state,
                lastN
            };
        }
    }
    return state;
});
