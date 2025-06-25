"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const functions_1 = require("../../base/conference/functions");
const i18next_1 = __importDefault(require("../../base/i18n/i18next"));
const MiddlewareRegistry_1 = __importDefault(require("../../base/redux/MiddlewareRegistry"));
const actionTypes_1 = require("../../base/tracks/actionTypes");
const functions_2 = require("./functions");
/**
 * Middleware that captures track permission errors and alerts the user so they
 * can enable the permission themselves.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.TRACK_CREATE_ERROR:
            // XXX We do not currently have user interface outside of a conference
            // which the user may tap and cause a permission-related error. If we
            // alert whenever we (intend to) ask for a permission, the scenario of
            // entering the WelcomePage, being asked for the camera permission, me
            // denying it, and being alerted that there is an error is overwhelming
            // me.
            if (action.permissionDenied
                && (0, functions_1.isRoomValid)(store.getState()['features/base/conference'].room)) {
                _alertPermissionErrorWithSettings(action.trackType);
            }
            break;
    }
    return result;
});
/**
 * Shows an alert panel which tells the user they have to manually grant some
 * permissions by opening Settings. A button which opens Settings is provided.
 *
 * @param {string} trackType - Type of track that failed with a permission
 * error.
 * @private
 * @returns {void}
 */
function _alertPermissionErrorWithSettings(trackType) {
    /* eslint-disable indent */
    const message = trackType === 'video'
        ? i18next_1.default.t('dialog.permissionCameraRequiredError')
        : i18next_1.default.t('dialog.permissionMicRequiredError');
    /* eslint-ensable indent */
    react_native_1.Alert.alert(i18next_1.default.t('dialog.permissionErrorTitle'), message, [
        { text: i18next_1.default.t('dialog.Cancel') },
        {
            onPress: functions_2.openSettings,
            text: i18next_1.default.t('settings.title')
        }
    ], { cancelable: false });
}
