"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PersistenceRegistry_1 = __importDefault(require("../base/redux/PersistenceRegistry"));
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
PersistenceRegistry_1.default.register('features/screnshot-capture', true, {
    capturesEnabled: false
});
const DEFAULT_STATE = {
    capturesEnabled: false
};
ReducerRegistry_1.default.register('features/screenshot-capture', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SET_SCREENSHOT_CAPTURE: {
            return {
                ...state,
                capturesEnabled: action.payload
            };
        }
    }
    return state;
});
