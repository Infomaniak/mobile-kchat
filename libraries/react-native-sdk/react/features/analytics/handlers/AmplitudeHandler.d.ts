import AbstractHandler, { IEvent } from './AbstractHandler';
/**
 * Analytics handler for Amplitude.
 */
export default class AmplitudeHandler extends AbstractHandler {
    _deviceId: string;
    _userId: Object;
    /**
     * Creates new instance of the Amplitude analytics handler.
     *
     * @param {Object} options - The amplitude options.
     * @param {string} options.amplitudeAPPKey - The Amplitude app key required by the Amplitude API.
     * @param {boolean} options.amplitudeIncludeUTM - Whether to include UTM parameters
     * in the Amplitude events.
     */
    constructor(options: any);
    /**
     * Sets the Amplitude user properties.
     *
     * @param {Object} userProps - The user portperties.
     * @returns {void}
     */
    setUserProperties(userProps: any): void;
    /**
     * Sends an event to Amplitude. The format of the event is described
     * in AnalyticsAdapter in lib-jitsi-meet.
     *
     * @param {Object} event - The event in the format specified by
     * lib-jitsi-meet.
     * @returns {void}
     */
    sendEvent(event: IEvent): void;
    /**
     * Return amplitude identity information.
     *
     * @returns {Object}
     */
    getIdentityProps(): {
        deviceId: string;
        userId: Object;
        sessionId?: undefined;
    } | {
        sessionId: number;
        deviceId: string | undefined;
        userId: string | undefined;
    };
}
