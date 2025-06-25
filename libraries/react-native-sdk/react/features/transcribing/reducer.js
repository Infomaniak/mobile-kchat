"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
/**
 * Returns initial state for transcribing feature part of Redux store.
 *
 * @returns {{
 * isTranscribing: boolean,
 * transcriberJID: null,
 * potentialTranscriberJIDs: Array
 * }}
 * @private
 */
function _getInitialState() {
    return {
        /**
         * Indicates whether there is currently an active transcriber in the
         * room.
         *
         * @type {boolean}
         */
        isTranscribing: false,
        /**
         * The JID of the active transcriber.
         *
         * @type { string }
         */
        transcriberJID: null,
        /**
         * A list containing potential JID's of transcriber participants.
         *
         * @type { Array }
         */
        potentialTranscriberJIDs: []
    };
}
/**
 * Reduces the Redux actions of the feature features/transcribing.
 */
ReducerRegistry_1.default.register('features/transcribing', (state = _getInitialState(), action) => {
    switch (action.type) {
        case actionTypes_1._TRANSCRIBER_JOINED:
            return {
                ...state,
                isTranscribing: true,
                transcriberJID: action.transcriberJID
            };
        case actionTypes_1._TRANSCRIBER_LEFT:
            return {
                ...state,
                isTranscribing: false,
                transcriberJID: undefined,
                potentialTranscriberJIDs: []
            };
        case actionTypes_1._POTENTIAL_TRANSCRIBER_JOINED:
            return {
                ...state,
                potentialTranscriberJIDs: [action.transcriberJID, ...state.potentialTranscriberJIDs]
            };
        default:
            return state;
    }
});
