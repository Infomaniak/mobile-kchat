"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PersistenceRegistry_1 = __importDefault(require("../base/redux/PersistenceRegistry"));
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const functions_1 = require("../base/redux/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * The default state of the calendar feature.
 *
 * @type {Object}
 */
const DEFAULT_STATE = {
    authorization: undefined,
    events: [],
    integrationReady: false,
    integrationType: undefined,
    msAuthState: undefined
};
/**
 * Constant for the Redux subtree of the calendar feature.
 *
 * NOTE: This feature can be disabled and in that case, accessing this subtree
 * directly will return undefined and will need a bunch of repetitive type
 * checks in other features. Make sure you take care of those checks, or
 * consider using the {@code isCalendarEnabled} value to gate features if
 * needed.
 */
const STORE_NAME = 'features/calendar-sync';
/**
 * NOTE: Never persist the authorization value as it's needed to remain a
 * runtime value to see if we need to re-request the calendar permission from
 * the user.
 */
PersistenceRegistry_1.default.register(STORE_NAME, {
    integrationType: true,
    msAuthState: true
});
ReducerRegistry_1.default.register(STORE_NAME, (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.CLEAR_CALENDAR_INTEGRATION:
            return DEFAULT_STATE;
        case actionTypes_1.SET_CALENDAR_AUTH_STATE: {
            if (!action.msAuthState) {
                // received request to delete the state
                return (0, functions_1.set)(state, 'msAuthState', undefined);
            }
            return (0, functions_1.set)(state, 'msAuthState', {
                ...state.msAuthState,
                ...action.msAuthState
            });
        }
        case actionTypes_1.SET_CALENDAR_AUTHORIZATION:
            return (0, functions_1.set)(state, 'authorization', action.authorization);
        case actionTypes_1.SET_CALENDAR_ERROR:
            return (0, functions_1.set)(state, 'error', action.error);
        case actionTypes_1.SET_CALENDAR_EVENTS:
            return (0, functions_1.set)(state, 'events', action.events);
        case actionTypes_1.SET_CALENDAR_INTEGRATION:
            return {
                ...state,
                integrationReady: action.integrationReady,
                integrationType: action.integrationType
            };
        case actionTypes_1.SET_CALENDAR_PROFILE_EMAIL:
            return (0, functions_1.set)(state, 'profileEmail', action.email);
        case actionTypes_1.SET_LOADING_CALENDAR_EVENTS:
            return (0, functions_1.set)(state, 'isLoadingEvents', action.isLoadingEvents);
    }
    return state;
});
