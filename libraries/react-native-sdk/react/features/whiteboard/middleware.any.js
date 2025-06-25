"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actionTypes_1 = require("../base/conference/actionTypes");
const functions_2 = require("../base/conference/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actionTypes_2 = require("./actionTypes");
const actions_1 = require("./actions");
const constants_1 = require("./constants");
const functions_3 = require("./functions");
MiddlewareRegistry_1.default.register((store) => next => action => {
    const state = store.getState();
    switch (action.type) {
        case actionTypes_2.SET_WHITEBOARD_OPEN: {
            const enforceUserLimit = (0, functions_3.shouldEnforceUserLimit)(state);
            const notifyUserLimit = (0, functions_3.shouldNotifyUserLimit)(state);
            if (action.isOpen && !enforceUserLimit && !notifyUserLimit) {
                (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createOpenWhiteboardEvent)());
                return next(action);
            }
            break;
        }
        case actionTypes_1.UPDATE_CONFERENCE_METADATA: {
            const { metadata } = action;
            if (metadata?.[constants_1.WHITEBOARD_ID]) {
                store.dispatch((0, actions_1.setupWhiteboard)({
                    collabDetails: metadata[constants_1.WHITEBOARD_ID].collabDetails,
                    collabServerUrl: (0, functions_3.generateCollabServerUrl)(store.getState())
                }));
                store.dispatch((0, actions_1.setWhiteboardOpen)(true));
            }
            break;
        }
    }
    return next(action);
});
/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed, e.g. Disable the whiteboard if it's left open.
 */
StateListenerRegistry_1.default.register(state => (0, functions_2.getCurrentConference)(state), (conference, { dispatch }, previousConference) => {
    if (conference !== previousConference) {
        dispatch((0, actions_1.resetWhiteboard)());
    }
});
/**
 * Set up state change listener to limit whiteboard access.
 */
StateListenerRegistry_1.default.register(state => (0, functions_3.shouldEnforceUserLimit)(state), (enforceUserLimit, { dispatch, getState }) => {
    if ((0, functions_3.isWhiteboardOpen)(getState()) && enforceUserLimit) {
        dispatch((0, actions_1.restrictWhiteboard)());
    }
});
/**
 * Set up state change listener to notify about whiteboard usage.
 */
StateListenerRegistry_1.default.register(state => (0, functions_3.shouldNotifyUserLimit)(state), (notifyUserLimit, { dispatch, getState }, prevNotifyUserLimit) => {
    if ((0, functions_3.isWhiteboardOpen)(getState()) && notifyUserLimit && !prevNotifyUserLimit) {
        dispatch((0, actions_1.notifyWhiteboardLimit)());
    }
});
