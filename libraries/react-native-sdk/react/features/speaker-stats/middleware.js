"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actionTypes_1 = require("../base/participants/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_2 = require("./actionTypes");
const actions_any_1 = require("./actions.any");
const constants_1 = require("./constants");
const functions_1 = require("./functions");
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => (next) => (action) => {
    switch (action.type) {
        case actionTypes_2.INIT_SEARCH: {
            const state = getState();
            const stats = (0, functions_1.filterBySearchCriteria)(state);
            dispatch((0, actions_any_1.updateStats)(stats));
            break;
        }
        case actionTypes_2.INIT_UPDATE_STATS:
            if (action.getSpeakerStats) {
                const state = getState();
                const speakerStats = { ...action.getSpeakerStats() };
                const stats = (0, functions_1.filterBySearchCriteria)(state, speakerStats);
                const pendingReorder = (0, functions_1.getPendingReorder)(state);
                (0, react_redux_1.batch)(() => {
                    if (pendingReorder) {
                        dispatch((0, actions_any_1.updateSortedSpeakerStatsIds)((0, functions_1.getSortedSpeakerStatsIds)(state, stats) ?? []));
                    }
                    dispatch((0, actions_any_1.updateStats)(stats));
                });
            }
            break;
        case actionTypes_2.RESET_SEARCH_CRITERIA: {
            const state = getState();
            const stats = (0, functions_1.resetHiddenStats)(state);
            dispatch((0, actions_any_1.updateStats)(stats));
            break;
        }
        case actionTypes_1.PARTICIPANT_JOINED:
        case actionTypes_1.PARTICIPANT_LEFT:
        case actionTypes_1.PARTICIPANT_KICKED:
        case actionTypes_1.PARTICIPANT_UPDATED: {
            const { pendingReorder } = getState()['features/speaker-stats'];
            if (!pendingReorder) {
                dispatch((0, actions_any_1.initReorderStats)());
            }
            break;
        }
        case actionTypes_2.ADD_TO_OFFSET: {
            const state = getState();
            const { timelineBoundary } = state['features/speaker-stats'];
            const { right } = (0, functions_1.getTimelineBoundaries)(state);
            const currentDuration = (0, functions_1.getCurrentDuration)(state) ?? 0;
            if (Math.abs((right + action.value) - currentDuration) < constants_1.CLEAR_TIME_BOUNDARY_THRESHOLD) {
                dispatch((0, actions_any_1.clearTimelineBoundary)());
            }
            else if (!timelineBoundary) {
                dispatch((0, actions_any_1.setTimelineBoundary)(currentDuration ?? 0));
            }
            break;
        }
    }
    return next(action);
});
