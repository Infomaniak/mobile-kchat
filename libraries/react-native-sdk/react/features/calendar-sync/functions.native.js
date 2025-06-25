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
exports._fetchCalendarEntries = exports.isCalendarEnabled = exports.addLinkToCalendarEntry = void 0;
const react_native_1 = require("react-native");
const react_native_calendar_events_1 = __importDefault(require("react-native-calendar-events"));
const constants_1 = require("../base/flags/constants");
const functions_1 = require("../base/flags/functions");
const functions_2 = require("../invite/functions");
const actions_native_1 = require("./actions.native");
const constants_2 = require("./constants");
const functions_native_1 = require("./functions.native");
const logger_1 = __importDefault(require("./logger"));
__exportStar(require("./functions.any"), exports);
/**
 * Adds a Jitsi link to a calendar entry.
 *
 * @param {Object} state - The Redux state.
 * @param {string} id - The ID of the calendar entry.
 * @param {string} link - The link to add info with.
 * @returns {Promise<*>}
 */
function addLinkToCalendarEntry(state, id, link) {
    return new Promise((resolve, reject) => {
        (0, functions_2.getShareInfoText)(state, link, true).then((shareInfoText) => {
            react_native_calendar_events_1.default.findEventById(id).then((event) => {
                const updateText = event.description
                    ? `${event.description}\n\n${shareInfoText}`
                    : shareInfoText;
                const updateObject = {
                    id: event.id,
                    ...react_native_1.Platform.select({
                        ios: {
                            notes: updateText
                        },
                        android: {
                            description: updateText
                        }
                    })
                };
                // @ts-ignore
                react_native_calendar_events_1.default.saveEvent(event.title, updateObject)
                    .then(resolve, reject);
            }, reject);
        }, reject);
    });
}
exports.addLinkToCalendarEntry = addLinkToCalendarEntry;
/**
 * Determines whether the calendar feature is enabled by the app. For
 * example, Apple through its App Store requires
 * {@code NSCalendarsUsageDescription} in the app's Info.plist or App Store
 * rejects the app. It could also be disabled with a feature flag.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {boolean} If the app has enabled the calendar feature, {@code true};
 * otherwise, {@code false}.
 */
function isCalendarEnabled(stateful) {
    const flag = (0, functions_1.getFeatureFlag)(stateful, constants_1.CALENDAR_ENABLED);
    if (typeof flag !== 'undefined') {
        return flag;
    }
    const { calendarEnabled = true } = react_native_1.NativeModules.AppInfo;
    return calendarEnabled;
}
exports.isCalendarEnabled = isCalendarEnabled;
/**
 * Reads the user's calendar and updates the stored entries if need be.
 *
 * @param {Object} store - The redux store.
 * @param {boolean} maybePromptForPermission - Flag to tell the app if it should
 * prompt for a calendar permission if it wasn't granted yet.
 * @param {boolean|undefined} forcePermission - Whether to force to re-ask for
 * the permission or not.
 * @private
 * @returns {void}
 */
function _fetchCalendarEntries(store, maybePromptForPermission, forcePermission) {
    const { dispatch, getState } = store;
    const promptForPermission = (maybePromptForPermission
        && !getState()['features/calendar-sync'].authorization)
        || forcePermission;
    _ensureCalendarAccess(promptForPermission, dispatch)
        .then(accessGranted => {
        if (accessGranted) {
            const startDate = new Date();
            const endDate = new Date();
            startDate.setDate(startDate.getDate() + constants_2.FETCH_START_DAYS);
            endDate.setDate(endDate.getDate() + constants_2.FETCH_END_DAYS);
            react_native_calendar_events_1.default.fetchAllEvents(
            // @ts-ignore
            startDate.getTime(), endDate.getTime(), [])
                .then(functions_native_1._updateCalendarEntries.bind(store))
                .catch(error => logger_1.default.error('Error fetching calendar.', error));
        }
        else {
            logger_1.default.warn('Calendar access not granted.');
        }
    })
        .catch(reason => logger_1.default.error('Error accessing calendar.', reason));
}
exports._fetchCalendarEntries = _fetchCalendarEntries;
/**
 * Ensures calendar access if possible and resolves the promise if it's granted.
 *
 * @param {boolean} promptForPermission - Flag to tell the app if it should
 * prompt for a calendar permission if it wasn't granted yet.
 * @param {Function} dispatch - The Redux dispatch function.
 * @private
 * @returns {Promise}
 */
function _ensureCalendarAccess(promptForPermission, dispatch) {
    return new Promise((resolve, reject) => {
        react_native_calendar_events_1.default.checkPermissions()
            .then(status => {
            if (status === 'authorized') {
                resolve(true);
            }
            else if (promptForPermission) {
                react_native_calendar_events_1.default.requestPermissions()
                    .then(result => {
                    dispatch((0, actions_native_1.setCalendarAuthorization)(result));
                    resolve(result === 'authorized');
                })
                    .catch(reject);
            }
            else {
                resolve(false);
            }
        })
            .catch(reject);
    });
}
