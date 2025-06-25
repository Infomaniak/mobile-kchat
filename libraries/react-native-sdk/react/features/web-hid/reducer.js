"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
/**
 * The initial state of the web-hid feature.
*/
const DEFAULT_STATE = {
    deviceInfo: {}
};
ReducerRegistry_1.default.register('features/web-hid', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.INIT_DEVICE:
            return {
                ...state,
                deviceInfo: action.deviceInfo
            };
        case actionTypes_1.UPDATE_DEVICE:
            return {
                ...state,
                deviceInfo: {
                    ...state.deviceInfo,
                    ...action.updates
                }
            };
        case actionTypes_1.CLOSE_HID_DEVICE:
            return {
                ...state,
                deviceInfo: DEFAULT_STATE.deviceInfo
            };
        default:
            return state;
    }
});
