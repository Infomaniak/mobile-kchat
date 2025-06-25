"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const actionTypes_1 = require("../base/app/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_1 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const OldElectronAPPNotificationDescription_1 = __importDefault(require("./components/OldElectronAPPNotificationDescription"));
const functions_1 = require("./functions");
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            return _appWillMount(store, next, action);
    }
    return next(action);
});
/**
 * Notifies the feature that the action {@link APP_WILL_MOUNT} has being dispatched.
 *
 * @param {Store} store - The redux store in which the specified {@code action} is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the specified {@code action}.
 * @param {Action} action - The redux action {@code APP_WILL_MOUNT} which is being dispatched.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the specified {@code action}.
 */
function _appWillMount(store, next, action) {
    if ((0, functions_1.isOldJitsiMeetElectronApp)()) {
        const { dispatch } = store;
        dispatch((0, actions_1.showErrorNotification)({
            titleKey: 'notify.OldElectronAPPTitle',
            description: react_1.default.createElement(OldElectronAPPNotificationDescription_1.default, null)
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
    }
    return next(action);
}
