"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const DEFAULT_STATE = {
    /**
     * URL for the shared document.
     */
    documentUrl: undefined,
    /**
     * Whether or not Etherpad is currently open.
     *
     * @public
     * @type {boolean}
     */
    editing: false
};
/**
 * Reduces the Redux actions of the feature features/etherpad.
 */
ReducerRegistry_1.default.register('features/etherpad', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SET_DOCUMENT_EDITING_STATUS:
            return {
                ...state,
                editing: action.editing
            };
        case actionTypes_1.SET_DOCUMENT_URL:
            return {
                ...state,
                documentUrl: action.documentUrl
            };
        default:
            return state;
    }
});
