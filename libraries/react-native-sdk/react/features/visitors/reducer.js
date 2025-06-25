"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_2 = require("./actionTypes");
const DEFAULT_STATE = {
    count: -1,
    iAmVisitor: false,
    showNotification: false,
    supported: false,
    promotionRequests: []
};
ReducerRegistry_1.default.register('features/visitors', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.CONFERENCE_WILL_LEAVE: {
            return {
                ...state,
                ...DEFAULT_STATE,
                // If the action was called because a visitor was promoted don't clear the iAmVisitor field. It will be set
                // to false with the I_AM_VISITOR_MODE action and we will be able to distinguish leaving the conference use
                // case and promoting a visitor use case.
                iAmVisitor: action.isRedirect ? state.iAmVisitor : DEFAULT_STATE.iAmVisitor
            };
        }
        case actionTypes_2.UPDATE_VISITORS_COUNT: {
            if (state.count === action.count) {
                return state;
            }
            return {
                ...state,
                count: action.count
            };
        }
        case actionTypes_2.I_AM_VISITOR_MODE: {
            return {
                ...state,
                iAmVisitor: action.enabled
            };
        }
        case actionTypes_2.SET_VISITOR_DEMOTE_ACTOR: {
            return {
                ...state,
                demoteActorDisplayName: action.displayName
            };
        }
        case actionTypes_2.SET_VISITORS_SUPPORTED: {
            return {
                ...state,
                supported: action.value
            };
        }
        case actionTypes_2.VISITOR_PROMOTION_REQUEST: {
            const currentRequests = state.promotionRequests || [];
            return {
                ...state,
                promotionRequests: [...currentRequests, action.request]
            };
        }
        case actionTypes_2.CLEAR_VISITOR_PROMOTION_REQUEST: {
            let currentRequests = state.promotionRequests || [];
            currentRequests = currentRequests.filter(r => r.from !== action.request.from);
            return {
                ...state,
                promotionRequests: currentRequests
            };
        }
    }
    return state;
});
