"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../../base/redux/ReducerRegistry"));
const functions_1 = require("../../base/redux/functions");
const actionTypes_1 = require("./actionTypes");
const DEFAULT_STATE = {
    devices: [],
    subscriptions: []
};
ReducerRegistry_1.default.register('features/mobile/audio-mode', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1._SET_AUDIOMODE_DEVICES: {
            const { devices } = action;
            if ((0, functions_1.equals)(state.devices, devices)) {
                return state;
            }
            return (0, functions_1.set)(state, 'devices', devices);
        }
        case actionTypes_1._SET_AUDIOMODE_SUBSCRIPTIONS:
            return (0, functions_1.set)(state, 'subscriptions', action.subscriptions);
    }
    return state;
});
