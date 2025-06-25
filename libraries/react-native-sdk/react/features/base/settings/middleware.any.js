"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const actionTypes_1 = require("../connection/actionTypes");
const actions_1 = require("../participants/actions");
const functions_1 = require("../participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const parseURLParams_1 = require("../util/parseURLParams");
const actionTypes_2 = require("./actionTypes");
const actions_2 = require("./actions");
/**
 * The middleware of the feature base/settings. Distributes changes to the state
 * of base/settings to the states of other features computed from the state of
 * base/settings.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_2.SETTINGS_UPDATED:
            _updateLocalParticipant(store, action);
            break;
        case actionTypes_1.SET_LOCATION_URL:
            _updateLocalParticipantFromUrl(store);
            break;
    }
    return result;
});
/**
 * Maps the settings field names to participant names where they don't match.
 * Currently there is only one such field, but may be extended in the future.
 *
 * @private
 * @param {string} settingsField - The name of the settings field to map.
 * @returns {string}
 */
function _mapSettingsFieldToParticipant(settingsField) {
    switch (settingsField) {
        case 'displayName':
            return 'name';
    }
    return settingsField;
}
/**
 * Updates the local participant according to settings changes.
 *
 * @param {Store} store - The redux store.
 * @param {Object} action - The dispatched action.
 * @private
 * @returns {void}
 */
function _updateLocalParticipant({ dispatch, getState }, action) {
    const { settings } = action;
    const localParticipant = (0, functions_1.getLocalParticipant)(getState());
    const newLocalParticipant = {
        ...localParticipant
    };
    for (const key in settings) {
        if (settings.hasOwnProperty(key)) {
            newLocalParticipant[_mapSettingsFieldToParticipant(key)]
                = settings[key];
        }
    }
    dispatch((0, actions_1.participantUpdated)({
        ...newLocalParticipant,
        id: newLocalParticipant.id ?? ''
    }));
}
/**
 * Returns the userInfo set in the URL.
 *
 * @param {Store} store - The redux store.
 * @private
 * @returns {void}
 */
function _updateLocalParticipantFromUrl({ dispatch, getState }) {
    const urlParams = (0, parseURLParams_1.parseURLParams)(getState()['features/base/connection'].locationURL ?? '');
    const urlEmail = urlParams['userInfo.email'];
    const urlDisplayName = urlParams['userInfo.displayName'];
    if (!urlEmail && !urlDisplayName) {
        return;
    }
    const localParticipant = (0, functions_1.getLocalParticipant)(getState());
    if (localParticipant) {
        const displayName = lodash_1.default.escape(urlDisplayName);
        const email = lodash_1.default.escape(urlEmail);
        dispatch((0, actions_1.participantUpdated)({
            ...localParticipant,
            email,
            name: displayName
        }));
        dispatch((0, actions_2.updateSettings)({
            displayName,
            email
        }));
    }
}
