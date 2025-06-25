"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PersistenceRegistry_1 = __importDefault(require("../base/redux/PersistenceRegistry"));
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const DEFAULT_STATE = {
    country: '',
    deviceStatusText: 'prejoin.configuringDevices',
    deviceStatusType: 'ok',
    dialOutCountry: {
        name: 'United States',
        dialCode: '1',
        code: 'us'
    },
    dialOutNumber: '',
    dialOutStatus: 'prejoin.dialing',
    name: '',
    rawError: '',
    showPrejoin: true,
    skipPrejoinOnReload: false,
    showJoinByPhoneDialog: false
};
/**
 * Sets up the persistence of the feature {@code prejoin}.
 */
PersistenceRegistry_1.default.register('features/prejoin', {
    skipPrejoinOnReload: true
}, DEFAULT_STATE);
/**
 * Listen for actions that mutate the prejoin state.
 */
ReducerRegistry_1.default.register('features/prejoin', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.PREJOIN_JOINING_IN_PROGRESS:
            return {
                ...state,
                joiningInProgress: action.value
            };
        case actionTypes_1.SET_SKIP_PREJOIN_RELOAD: {
            return {
                ...state,
                skipPrejoinOnReload: action.value
            };
        }
        case actionTypes_1.SET_PREJOIN_PAGE_VISIBILITY:
            return {
                ...state,
                showPrejoin: action.value
            };
        case actionTypes_1.SET_PREJOIN_DEVICE_ERRORS: {
            const status = getStatusFromErrors(action.value);
            return {
                ...state,
                ...status
            };
        }
        case actionTypes_1.SET_DEVICE_STATUS: {
            const { deviceStatusType, deviceStatusText } = action.value;
            return {
                ...state,
                deviceStatusText,
                deviceStatusType
            };
        }
        case actionTypes_1.SET_DIALOUT_NUMBER: {
            return {
                ...state,
                dialOutNumber: action.value
            };
        }
        case actionTypes_1.SET_DIALOUT_COUNTRY: {
            return {
                ...state,
                dialOutCountry: action.value
            };
        }
        case actionTypes_1.SET_DIALOUT_STATUS: {
            return {
                ...state,
                dialOutStatus: action.value
            };
        }
        case actionTypes_1.SET_JOIN_BY_PHONE_DIALOG_VISIBLITY: {
            return {
                ...state,
                showJoinByPhoneDialog: action.value
            };
        }
        default:
            return state;
    }
});
/**
 * Returns a suitable error object based on the track errors.
 *
 * @param {Object} errors - The errors got while creating local tracks.
 * @returns {Object}
 */
function getStatusFromErrors(errors) {
    const { audioOnlyError, videoOnlyError, audioAndVideoError } = errors;
    if (audioAndVideoError) {
        return {
            deviceStatusType: 'warning',
            deviceStatusText: 'prejoin.audioAndVideoError',
            rawError: audioAndVideoError.message
        };
    }
    if (audioOnlyError) {
        return {
            deviceStatusType: 'warning',
            deviceStatusText: 'prejoin.audioOnlyError',
            rawError: audioOnlyError.message
        };
    }
    if (videoOnlyError) {
        return {
            deviceStatusType: 'warning',
            deviceStatusText: 'prejoin.videoOnlyError',
            rawError: videoOnlyError.message
        };
    }
    return {
        deviceStatusType: 'ok',
        deviceStatusText: 'prejoin.lookGood',
        rawError: ''
    };
}
