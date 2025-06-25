"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
/**
 * The default state is the Google API needs loading.
 *
 * @type {{googleAPIState: number}}
 */
const DEFAULT_STATE = {
    googleAPIState: constants_1.GOOGLE_API_STATES.NEEDS_LOADING,
    profileEmail: ''
};
/**
 * Reduces the Redux actions of the feature features/google-api.
 */
ReducerRegistry_1.default.register('features/google-api', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SET_GOOGLE_API_STATE:
            return {
                ...state,
                googleAPIState: action.googleAPIState,
                googleResponse: action.googleResponse
            };
        case actionTypes_1.SET_GOOGLE_API_PROFILE:
            return {
                ...state,
                profileEmail: action.profileEmail
            };
    }
    return state;
});
