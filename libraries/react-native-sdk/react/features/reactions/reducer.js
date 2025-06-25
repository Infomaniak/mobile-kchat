"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
/**
 * Returns initial state for reactions' part of Redux store.
 *
 * @private
 * @returns {IReactionsState}
 */
function _getInitialState() {
    return {
        visible: false,
        buffer: [],
        timeoutID: null,
        queue: [],
        notificationDisplayed: false
    };
}
ReducerRegistry_1.default.register('features/reactions', (state = _getInitialState(), action) => {
    switch (action.type) {
        case actionTypes_1.TOGGLE_REACTIONS_VISIBLE:
            return {
                ...state,
                visible: !state.visible
            };
        case actionTypes_1.ADD_REACTION_BUFFER:
            return {
                ...state,
                buffer: action.buffer ?? [],
                timeoutID: action.timeoutID ?? null
            };
        case actionTypes_1.FLUSH_REACTION_BUFFER:
            return {
                ...state,
                buffer: [],
                timeoutID: null
            };
        case actionTypes_1.SET_REACTION_QUEUE: {
            return {
                ...state,
                queue: action.queue ?? []
            };
        }
        case actionTypes_1.SHOW_SOUNDS_NOTIFICATION: {
            return {
                ...state,
                notificationDisplayed: true
            };
        }
    }
    return state;
});
