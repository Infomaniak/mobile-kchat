"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
/**
 * Initial state.
 */
const DEFAULT_STATE = {
    isInitialized: false,
    initialPermanentProperties: {},
    localTracksDuration: {
        audio: {
            startedTime: -1,
            value: 0
        },
        video: {
            camera: {
                startedTime: -1,
                value: 0
            },
            desktop: {
                startedTime: -1,
                value: 0
            }
        },
        conference: {
            startedTime: -1,
            value: 0
        }
    }
};
/**
 * Listen for actions which changes the state of the analytics feature.
 *
 * @param {Object} state - The Redux state of the feature features/analytics.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @returns {Object}
 */
ReducerRegistry_1.default.register('features/analytics', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SET_INITIALIZED:
            return {
                ...state,
                initialPermanentProperties: action.value ? state.initialPermanentProperties : {},
                isInitialized: action.value
            };
        case actionTypes_1.SET_INITIAL_PERMANENT_PROPERTIES:
            return {
                ...state,
                initialPermanentProperties: {
                    ...state.initialPermanentProperties,
                    ...action.properties
                }
            };
        case actionTypes_1.UPDATE_LOCAL_TRACKS_DURATION:
            return {
                ...state,
                localTracksDuration: action.localTracksDuration
            };
        default:
            return state;
    }
});
