"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const functions_native_1 = require("../app/functions.native");
const constants_1 = require("../base/flags/constants");
const functions_1 = require("../base/flags/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const functions_2 = require("../invite/functions");
const actionTypes_1 = require("./actionTypes");
const actions_1 = require("./actions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Middleware that captures room URL sharing actions and starts the sharing
 * process.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.BEGIN_SHARE_ROOM:
            _shareRoom(action.roomURL, store);
            break;
    }
    return next(action);
});
/**
 * Open the native sheet for sharing a specific conference/room URL.
 *
 * @param {string} roomURL - The URL of the conference/room to be shared.
 * @param {Store} store - Redux store.
 * @private
 * @returns {void}
 */
function _shareRoom(roomURL, { dispatch, getState }) {
    const dialInEnabled = (0, functions_1.getFeatureFlag)(getState(), constants_1.INVITE_DIAL_IN_ENABLED, true);
    (0, functions_2.getShareInfoText)(getState(), roomURL, false /* useHtml */, !dialInEnabled /* skipDialIn */)
        .then(message => {
        const title = `${(0, functions_native_1.getName)()} Conference`;
        const onFulfilled = (shared) => dispatch((0, actions_1.endShareRoom)(roomURL, shared));
        react_native_1.Share.share(
        /* content */ {
            message,
            title
        }, 
        /* options */ {
            dialogTitle: title,
            subject: title // iOS
        })
            .then(
        /* onFulfilled */ value => {
            onFulfilled(value.action === react_native_1.Share.sharedAction);
        }, 
        /* onRejected */ reason => {
            logger_1.default.error(`Failed to share conference/room URL ${roomURL}:`, reason);
            onFulfilled(false);
        })
            .finally(() => {
            dispatch((0, actions_1.toggleShareDialog)(false));
        });
    });
}
