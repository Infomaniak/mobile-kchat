"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._getCalendarIntegration = exports._fetchCalendarEntries = exports.isCalendarEnabled = void 0;
const functions_1 = require("../base/redux/functions");
const actions_web_1 = require("./actions.web");
__exportStar(require("./functions.any"), exports);
const constants_1 = require("./constants");
const functions_web_1 = require("./functions.web");
const logger_1 = __importDefault(require("./logger"));
const googleCalendar_1 = require("./web/googleCalendar");
const microsoftCalendar_1 = require("./web/microsoftCalendar");
/**
 * Determines whether the calendar feature is enabled by the web.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {boolean} If the app has enabled the calendar feature, {@code true};
 * otherwise, {@code false}.
 */
function isCalendarEnabled(stateful) {
    const { enableCalendarIntegration, googleApiApplicationClientID, microsoftApiApplicationClientID } = (0, functions_1.toState)(stateful)['features/base/config'] || {};
    return Boolean(enableCalendarIntegration && (googleApiApplicationClientID || microsoftApiApplicationClientID));
}
exports.isCalendarEnabled = isCalendarEnabled;
/**
 * Reads the user's calendar and updates the stored entries if need be.
 *
 * @param {Object} store - The redux store.
 * @param {boolean} _maybePromptForPermission - Flag to tell the app if it should
 * prompt for a calendar permission if it wasn't granted yet.
 * @param {boolean|undefined} _forcePermission - Whether to force to re-ask for
 * the permission or not.
 * @private
 * @returns {void}
 */
function _fetchCalendarEntries(store, _maybePromptForPermission, _forcePermission) {
    const { dispatch, getState } = store;
    const { integrationType = '' } = getState()['features/calendar-sync'];
    const integration = _getCalendarIntegration(integrationType);
    if (!integration) {
        logger_1.default.debug('No calendar type available');
        return;
    }
    dispatch((0, actions_web_1.setLoadingCalendarEvents)(true));
    dispatch(integration.load())
        .then(() => dispatch(integration._isSignedIn()))
        .then((signedIn) => {
        if (signedIn) {
            return Promise.resolve();
        }
        return Promise.reject({
            error: constants_1.ERRORS.AUTH_FAILED
        });
    })
        .then(() => dispatch(integration.getCalendarEntries(constants_1.FETCH_START_DAYS, constants_1.FETCH_END_DAYS)))
        .then((events) => functions_web_1._updateCalendarEntries.call({
        dispatch,
        getState
    }, events))
        .then(() => {
        dispatch((0, actions_web_1.setCalendarError)());
    }, (error) => {
        logger_1.default.error('Error fetching calendar.', error);
        if (error.error === constants_1.ERRORS.AUTH_FAILED) {
            dispatch((0, actions_web_1.clearCalendarIntegration)());
        }
        dispatch((0, actions_web_1.setCalendarError)(error));
    })
        .then(() => dispatch((0, actions_web_1.setLoadingCalendarEvents)(false)));
}
exports._fetchCalendarEntries = _fetchCalendarEntries;
/**
 * Returns the calendar API implementation by specified type.
 *
 * @param {string} calendarType - The calendar type API as defined in
 * the constant {@link CALENDAR_TYPE}.
 * @private
 * @returns {Object|undefined}
 */
function _getCalendarIntegration(calendarType) {
    switch (calendarType) {
        case constants_1.CALENDAR_TYPE.GOOGLE:
            return googleCalendar_1.googleCalendarApi;
        case constants_1.CALENDAR_TYPE.MICROSOFT:
            return microsoftCalendar_1.microsoftCalendarApi;
    }
}
exports._getCalendarIntegration = _getCalendarIntegration;
