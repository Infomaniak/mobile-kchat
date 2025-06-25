"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/config/actionTypes");
const actionTypes_2 = require("../base/known-domains/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const functions_1 = require("../base/redux/functions");
const actionTypes_3 = require("../mobile/background/actionTypes");
const actionTypes_4 = require("./actionTypes");
const actions_1 = require("./actions");
const functions_2 = require("./functions");
MiddlewareRegistry_1.default.register(store => next => action => {
    const { getState } = store;
    if (!(0, functions_2.isCalendarEnabled)(getState)) {
        return next(action);
    }
    switch (action.type) {
        case actionTypes_2.ADD_KNOWN_DOMAINS: {
            // XXX Fetch new calendar entries only when an actual domain has
            // become known.
            const oldValue = getState()['features/base/known-domains'];
            const result = next(action);
            const newValue = getState()['features/base/known-domains'];
            (0, functions_1.equals)(oldValue, newValue)
                || (0, functions_2._fetchCalendarEntries)(store, false, false);
            return result;
        }
        case actionTypes_3.APP_STATE_CHANGED: {
            const result = next(action);
            _maybeClearAccessStatus(store, action);
            return result;
        }
        case actionTypes_1.SET_CONFIG: {
            const result = next(action);
            (0, functions_2._fetchCalendarEntries)(store, false, false);
            return result;
        }
        case actionTypes_4.REFRESH_CALENDAR: {
            const result = next(action);
            (0, functions_2._fetchCalendarEntries)(store, action.isInteractive, action.forcePermission);
            return result;
        }
    }
    return next(action);
});
/**
 * Clears the calendar access status when the app comes back from the
 * background. This is needed as some users may never quit the app, but puts it
 * into the background and we need to try to request for a permission as often
 * as possible, but not annoyingly often.
 *
 * @param {Object} store - The redux store.
 * @param {Object} action - The Redux action.
 * @private
 * @returns {void}
 */
function _maybeClearAccessStatus(store, { appState }) {
    appState === 'background'
        && store.dispatch((0, actions_1.setCalendarAuthorization)(undefined));
}
