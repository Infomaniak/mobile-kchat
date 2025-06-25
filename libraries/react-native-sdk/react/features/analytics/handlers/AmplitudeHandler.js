"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const AbstractHandler_1 = __importDefault(require("./AbstractHandler"));
const fixDeviceID_1 = require("./amplitude/fixDeviceID");
const lib_1 = __importDefault(require("./amplitude/lib"));
/**
 * Analytics handler for Amplitude.
 */
class AmplitudeHandler extends AbstractHandler_1.default {
    /**
     * Creates new instance of the Amplitude analytics handler.
     *
     * @param {Object} options - The amplitude options.
     * @param {string} options.amplitudeAPPKey - The Amplitude app key required by the Amplitude API.
     * @param {boolean} options.amplitudeIncludeUTM - Whether to include UTM parameters
     * in the Amplitude events.
     */
    constructor(options) {
        super(options);
        const { amplitudeAPPKey, amplitudeIncludeUTM: includeUtm = true, user } = options;
        this._enabled = true;
        const onError = (e) => {
            logger_1.default.error('Error initializing Amplitude', e);
            this._enabled = false;
        };
        // Forces sending all events on exit (flushing) via sendBeacon
        const onExitPage = () => {
            // @ts-ignore
            lib_1.default.getInstance().sendEvents();
        };
        if (navigator.product === 'ReactNative') {
            lib_1.default.getInstance().init(amplitudeAPPKey);
            (0, fixDeviceID_1.fixDeviceID)(lib_1.default.getInstance()).then(() => {
                lib_1.default.getInstance().getDeviceId()
                    // @ts-ignore
                    .then((deviceId) => {
                    this._deviceId = deviceId;
                });
            });
        }
        else {
            const amplitudeOptions = {
                includeReferrer: true,
                includeUtm,
                saveParamsReferrerOncePerSession: false,
                onError,
                onExitPage
            };
            // @ts-ignore
            lib_1.default.getInstance().init(amplitudeAPPKey, undefined, amplitudeOptions);
            (0, fixDeviceID_1.fixDeviceID)(lib_1.default.getInstance());
        }
        if (user) {
            this._userId = user;
            lib_1.default.getInstance().setUserId(user);
        }
    }
    /**
     * Sets the Amplitude user properties.
     *
     * @param {Object} userProps - The user portperties.
     * @returns {void}
     */
    setUserProperties(userProps) {
        if (this._enabled) {
            lib_1.default.getInstance().setUserProperties(userProps);
        }
    }
    /**
     * Sends an event to Amplitude. The format of the event is described
     * in AnalyticsAdapter in lib-jitsi-meet.
     *
     * @param {Object} event - The event in the format specified by
     * lib-jitsi-meet.
     * @returns {void}
     */
    sendEvent(event) {
        if (this._shouldIgnore(event)) {
            return;
        }
        // @ts-ignore
        lib_1.default.getInstance().logEvent(this._extractName(event) ?? '', event);
    }
    /**
     * Return amplitude identity information.
     *
     * @returns {Object}
     */
    getIdentityProps() {
        if (navigator.product === 'ReactNative') {
            return {
                deviceId: this._deviceId,
                userId: this._userId
            };
        }
        return {
            sessionId: lib_1.default.getInstance().getSessionId(),
            // @ts-ignore
            deviceId: lib_1.default.getInstance().options.deviceId,
            // @ts-ignore
            userId: lib_1.default.getInstance().options.userId
        };
    }
}
exports.default = AmplitudeHandler;
