"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/app/actionTypes");
const functions_web_1 = require("../base/config/functions.web");
const actionTypes_2 = require("../base/media/actionTypes");
const functions_1 = require("../base/media/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_3 = require("./actionTypes");
const actions_1 = require("./actions");
const functions_2 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
const types_1 = require("./types");
/**
 * A listener for initialising the webhid device.
 */
let initDeviceListener;
/**
 * A listener for updating the webhid device.
 */
let updateDeviceListener;
/**
 * The redux middleware for {@link WebHid}.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register((store) => next => async (action) => {
    const { dispatch, getState } = store;
    if (!(0, functions_web_1.getWebHIDFeatureConfig)(getState())) {
        return next(action);
    }
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT: {
            const hidManager = (0, functions_2.getWebHidInstance)();
            if (!hidManager.isSupported()) {
                logger_1.default.warn('HID is not supported');
                break;
            }
            const _initDeviceListener = (e) => dispatch((0, actions_1.initDeviceInfo)(e.detail.deviceInfo));
            const _updateDeviceListener = (e) => (0, functions_2.handleUpdateHidDevice)(dispatch, e);
            initDeviceListener = _initDeviceListener;
            updateDeviceListener = _updateDeviceListener;
            hidManager.listenToConnectedHid();
            (0, functions_2.attachHidEventListeners)(initDeviceListener, updateDeviceListener);
            break;
        }
        case actionTypes_1.APP_WILL_UNMOUNT: {
            const hidManager = (0, functions_2.getWebHidInstance)();
            if (!(0, functions_2.isDeviceHidSupported)()) {
                break;
            }
            (0, functions_2.removeHidEventListeners)(initDeviceListener, updateDeviceListener);
            hidManager.close();
            break;
        }
        case actionTypes_3.CLOSE_HID_DEVICE: {
            const hidManager = (0, functions_2.getWebHidInstance)();
            // cleanup event handlers when hid device is removed from Settings.
            (0, functions_2.removeHidEventListeners)(initDeviceListener, updateDeviceListener);
            hidManager.close();
            break;
        }
        case actionTypes_3.REQUEST_HID_DEVICE: {
            const hidManager = (0, functions_2.getWebHidInstance)();
            const availableDevices = await hidManager.requestHidDevices();
            // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
            if (!availableDevices || !availableDevices.length) {
                logger_1.default.info('HID device not available');
                break;
            }
            const _initDeviceListener = (e) => dispatch((0, actions_1.initDeviceInfo)(e.detail.deviceInfo));
            const _updateDeviceListener = (e) => {
                (0, functions_2.handleUpdateHidDevice)(dispatch, e);
            };
            initDeviceListener = _initDeviceListener;
            updateDeviceListener = _updateDeviceListener;
            (0, functions_2.attachHidEventListeners)(initDeviceListener, updateDeviceListener);
            await hidManager.listenToConnectedHid();
            // sync headset to mute if participant is already muted.
            if ((0, functions_1.isAudioMuted)(store.getState())) {
                hidManager.sendDeviceReport({ command: types_1.COMMANDS.MUTE_ON });
            }
            break;
        }
        case actionTypes_2.SET_AUDIO_MUTED: {
            const hidManager = (0, functions_2.getWebHidInstance)();
            if (!(0, functions_2.isDeviceHidSupported)()) {
                break;
            }
            hidManager.sendDeviceReport({ command: action.muted ? types_1.COMMANDS.MUTE_ON : types_1.COMMANDS.MUTE_OFF });
            break;
        }
    }
    return next(action);
});
