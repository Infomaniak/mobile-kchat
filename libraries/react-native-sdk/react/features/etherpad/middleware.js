"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const functions_1 = require("../base/conference/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const uri_1 = require("../base/util/uri");
const actionTypes_2 = require("./actionTypes");
const actions_1 = require("./actions");
const ETHERPAD_COMMAND = 'etherpad';
/**
 * Middleware that captures actions related to collaborative document editing
 * and notifies components not hooked into redux.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => next => action => {
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOIN_IN_PROGRESS: {
            const { conference } = action;
            conference.addCommandListener(ETHERPAD_COMMAND, ({ value }) => {
                let url;
                const { etherpad_base: etherpadBase } = getState()['features/base/config'];
                const etherpadBaseUrl = (0, uri_1.sanitizeUrl)(etherpadBase);
                if (etherpadBaseUrl) {
                    url = new URL(value, etherpadBaseUrl.toString()).toString();
                }
                dispatch((0, actions_1.setDocumentUrl)(url));
            });
            break;
        }
        case actionTypes_2.TOGGLE_DOCUMENT_EDITING: {
            if (typeof APP !== 'undefined') {
                APP.UI.onEtherpadClicked();
            }
            break;
        }
    }
    return next(action);
});
/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed, e.g. Clear messages or close the chat modal if it's left
 * open.
 */
StateListenerRegistry_1.default.register(state => (0, functions_1.getCurrentConference)(state), (conference, { dispatch }, previousConference) => {
    if (previousConference) {
        dispatch((0, actions_1.setDocumentUrl)(undefined));
    }
});
