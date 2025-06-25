"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const logger_1 = __importDefault(require("./logger"));
const DEFAULT_STATE = {
    /**
     * The indicator which determines whether (the) {@code CalleeInfo} is
     * visible.
     *
     * @type {boolean|undefined}
     */
    calleeInfoVisible: false,
    numbersEnabled: true,
    numbersFetched: false,
    pendingInviteRequests: []
};
ReducerRegistry_1.default.register('features/invite', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.ADD_PENDING_INVITE_REQUEST:
            return {
                ...state,
                pendingInviteRequests: [
                    ...state.pendingInviteRequests,
                    action.request
                ]
            };
        case actionTypes_1.REMOVE_PENDING_INVITE_REQUESTS:
            return {
                ...state,
                pendingInviteRequests: []
            };
        case actionTypes_1.SET_CALLEE_INFO_VISIBLE:
            return {
                ...state,
                calleeInfoVisible: action.calleeInfoVisible,
                initialCalleeInfo: action.initialCalleeInfo
            };
        case actionTypes_1.UPDATE_DIAL_IN_NUMBERS_FAILED:
            return {
                ...state,
                error: action.error
            };
        case actionTypes_1.UPDATE_DIAL_IN_NUMBERS_SUCCESS: {
            if (Array.isArray(action.dialInNumbers)) {
                return {
                    ...state,
                    conferenceID: action.conferenceID,
                    error: undefined,
                    numbers: action.dialInNumbers,
                    sipUri: action.sipUri,
                    numbersEnabled: true,
                    numbersFetched: true
                };
            }
            // this is the old format which is deprecated
            logger_1.default.warn('Using deprecated API for retrieving phone numbers');
            const { numbersEnabled } = action.dialInNumbers;
            return {
                ...state,
                conferenceID: action.conferenceID,
                error: undefined,
                numbers: action.dialInNumbers,
                numbersEnabled,
                numbersFetched: true
            };
        }
    }
    return state;
});
