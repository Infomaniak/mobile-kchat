"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const DEFAULT_STATE = {
    message: '',
    // The sentinel value -1 is used to denote no rating has been set and to
    // preserve pre-redux behavior.
    score: -1,
    submitted: false
};
/**
 * Reduces the Redux actions of the feature features/feedback.
 */
ReducerRegistry_1.default.register('features/feedback', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.CANCEL_FEEDBACK: {
            return {
                ...state,
                message: action.message,
                score: action.score
            };
        }
        case actionTypes_1.SUBMIT_FEEDBACK_ERROR:
        case actionTypes_1.SUBMIT_FEEDBACK_SUCCESS: {
            return {
                ...state,
                message: '',
                score: -1,
                submitted: true
            };
        }
    }
    return state;
});
