"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PersistenceRegistry_1 = __importDefault(require("../base/redux/PersistenceRegistry"));
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const functions_1 = require("../base/redux/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Sets up the persistence of the feature {@code authentication}.
 */
PersistenceRegistry_1.default.register('features/authentication', {
    tokenAuthUrlSuccessful: true
});
/**
 * Listens for actions which change the state of the authentication feature.
 *
 * @param {Object} state - The Redux state of the authentication feature.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @returns {Object}
 */
ReducerRegistry_1.default.register('features/authentication', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1.CANCEL_LOGIN:
            return (0, functions_1.assign)(state, {
                error: undefined,
                progress: undefined,
                thenableWithCancel: undefined
            });
        case actionTypes_1.SET_TOKEN_AUTH_URL_SUCCESS:
            return (0, functions_1.assign)(state, {
                tokenAuthUrlSuccessful: action.value
            });
        case actionTypes_1.STOP_WAIT_FOR_OWNER:
            return (0, functions_1.assign)(state, {
                error: undefined,
                waitForOwnerTimeoutID: undefined
            });
        case actionTypes_1.UPGRADE_ROLE_FINISHED: {
            let { thenableWithCancel } = action;
            if (state.thenableWithCancel === thenableWithCancel) {
                const { error, progress } = action;
                // An error interrupts the process of authenticating and upgrading
                // the role of the local participant/user i.e. the process is no
                // more. Obviously, the process seizes to exist also when it does
                // its whole job.
                if (error || progress === 1) {
                    thenableWithCancel = undefined;
                }
                return (0, functions_1.assign)(state, {
                    error,
                    progress: progress || undefined,
                    thenableWithCancel
                });
            }
            break;
        }
        case actionTypes_1.UPGRADE_ROLE_STARTED:
            return (0, functions_1.assign)(state, {
                error: undefined,
                progress: undefined,
                thenableWithCancel: action.thenableWithCancel
            });
        case actionTypes_1.WAIT_FOR_OWNER:
            return (0, functions_1.assign)(state, {
                waitForOwnerTimeoutID: action.waitForOwnerTimeoutID
            });
    }
    return state;
});
