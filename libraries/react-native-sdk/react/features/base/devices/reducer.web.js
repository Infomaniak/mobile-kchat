"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const functions_web_1 = require("./functions.web");
const logger_1 = __importDefault(require("./logger"));
const DEFAULT_STATE = {
    availableDevices: {
        audioInput: [],
        audioOutput: [],
        videoInput: []
    },
    pendingRequests: [],
    permissions: {
        audio: false,
        video: false
    }
};
/**
 * Listen for actions which changes the state of known and used devices.
 *
 * @param {IDevicesState} state - The Redux state of the feature features/base/devices.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @param {Array<MediaDeviceInfo>} action.devices - All available audio and
 * video devices.
 * @returns {Object}
 */
ReducerRegistry_1.default.register('features/base/devices', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.UPDATE_DEVICE_LIST: {
            const deviceList = (0, functions_web_1.groupDevicesByKind)(action.devices);
            return {
                ...state,
                availableDevices: deviceList
            };
        }
        case actionTypes_1.ADD_PENDING_DEVICE_REQUEST:
            return {
                ...state,
                pendingRequests: [
                    ...state.pendingRequests,
                    action.request
                ]
            };
        case actionTypes_1.REMOVE_PENDING_DEVICE_REQUESTS:
            return {
                ...state,
                pendingRequests: []
            };
        // TODO: Changing of current audio and video device id is currently handled outside of react/redux.
        case actionTypes_1.SET_AUDIO_INPUT_DEVICE: {
            logger_1.default.debug(`set audio input device: ${action.deviceId}`);
            return state;
        }
        case actionTypes_1.SET_VIDEO_INPUT_DEVICE: {
            logger_1.default.debug(`set video input device: ${action.deviceId}`);
            return state;
        }
        case actionTypes_1.DEVICE_PERMISSIONS_CHANGED: {
            return {
                ...state,
                permissions: action.permissions
            };
        }
        default:
            return state;
    }
});
