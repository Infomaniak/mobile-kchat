"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_1 = require("./actionTypes");
const actions_1 = require("./actions");
const constants_1 = require("./constants");
const function_any_1 = require("./function.any");
/**
 * Middleware which intercepts Gifs actions to handle changes to the
 * visibility timeout of the Gifs.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    const { dispatch, getState } = store;
    const state = getState();
    switch (action.type) {
        case actionTypes_1.ADD_GIF_FOR_PARTICIPANT: {
            const id = action.participantId;
            const { giphy } = state['features/base/config'];
            _clearGifTimeout(state, id);
            const timeoutID = setTimeout(() => dispatch((0, actions_1.removeGif)(id)), giphy?.tileTime || constants_1.GIF_DEFAULT_TIMEOUT);
            action.timeoutID = timeoutID;
            break;
        }
        case actionTypes_1.SHOW_GIF_FOR_PARTICIPANT: {
            const id = action.participantId;
            _clearGifTimeout(state, id);
            break;
        }
        case actionTypes_1.HIDE_GIF_FOR_PARTICIPANT: {
            const { giphy } = state['features/base/config'];
            const id = action.participantId;
            const timeoutID = setTimeout(() => dispatch((0, actions_1.removeGif)(id)), giphy?.tileTime || constants_1.GIF_DEFAULT_TIMEOUT);
            action.timeoutID = timeoutID;
            break;
        }
    }
    return next(action);
});
/**
 * Clears GIF timeout.
 *
 * @param {IReduxState} state - Redux state.
 * @param {string} id - Id of the participant for whom to clear the timeout.
 * @returns {void}
 */
function _clearGifTimeout(state, id) {
    const gif = (0, function_any_1.getGifForParticipant)(state, id);
    clearTimeout(gif?.timeoutID ?? -1);
}
