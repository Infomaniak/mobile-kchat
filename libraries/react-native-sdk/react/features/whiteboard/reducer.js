"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const DEFAULT_STATE = {
    isOpen: false,
    collabDetails: undefined,
    collabServerUrl: undefined
};
ReducerRegistry_1.default.register('features/whiteboard', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SETUP_WHITEBOARD: {
            return {
                ...state,
                isOpen: true,
                collabDetails: action.collabDetails,
                collabServerUrl: action.collabServerUrl
            };
        }
        case actionTypes_1.RESET_WHITEBOARD:
            return DEFAULT_STATE;
    }
    return state;
});
