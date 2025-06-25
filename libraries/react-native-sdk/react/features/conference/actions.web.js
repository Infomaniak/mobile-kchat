"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.setupInitialDevices = exports.dismissCalendarNotification = exports.openLeaveReasonDialog = void 0;
const actions_web_1 = require("../base/devices/actions.web");
const actions_1 = require("../base/dialog/actions");
const uri_1 = require("../base/util/uri");
const actionTypes_1 = require("./actionTypes");
const LeaveReasonDialog_web_1 = __importDefault(require("./components/web/LeaveReasonDialog.web"));
const logger_1 = __importDefault(require("./logger"));
/**
 * Opens {@code LeaveReasonDialog}.
 *
 * @param {string} [title] - The dialog title.
 *
 * @returns {Promise} Resolved when the dialog is closed.
 */
function openLeaveReasonDialog(title) {
    return (dispatch) => new Promise(resolve => {
        dispatch((0, actions_1.openDialog)(LeaveReasonDialog_web_1.default, {
            onClose: resolve,
            title
        }));
    });
}
exports.openLeaveReasonDialog = openLeaveReasonDialog;
/**
 * Dismisses calendar notification about next or ongoing event.
 *
 * @returns {Object}
 */
function dismissCalendarNotification() {
    return {
        type: actionTypes_1.DISMISS_CALENDAR_NOTIFICATION
    };
}
exports.dismissCalendarNotification = dismissCalendarNotification;
/**
 * Setups initial devices. Makes sure we populate availableDevices list before configuring.
 *
 * @returns {Promise<any>}
 */
function setupInitialDevices() {
    return async (dispatch) => {
        await dispatch((0, actions_web_1.getAvailableDevices)());
        await dispatch((0, actions_web_1.configureInitialDevices)());
    };
}
exports.setupInitialDevices = setupInitialDevices;
/**
 * Init.
 *
 * @returns {Promise<JitsiConnection>}
 */
function init() {
    return (dispatch, getState) => {
        const room = (0, uri_1.getBackendSafeRoomName)(getState()['features/base/conference'].room);
        // XXX For web based version we use conference initialization logic
        // from the old app (at the moment of writing).
        return dispatch(setupInitialDevices()).then(() => APP.conference.init({
            roomName: room
        }).catch((error) => {
            APP.API.notifyConferenceLeft(APP.conference.roomName);
            logger_1.default.error(error);
        }));
    };
}
exports.init = init;
