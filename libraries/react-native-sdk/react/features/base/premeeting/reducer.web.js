"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const DEFAULT_STATE = {
    unsafeRoomConsent: false
};
/**
 * Listen for actions which changes the state of known and used devices.
 *
 * @param {IDevicesState} state - The Redux state of the feature features/base/devices.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @returns {IPreMeetingState}
 */
ReducerRegistry_1.default.register('features/base/premeeting', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SET_UNSAFE_ROOM_CONSENT: {
            return {
                ...state,
                unsafeRoomConsent: action.consent
            };
        }
        default:
            return state;
    }
});
