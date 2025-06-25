import AbstractHandler, { IEvent } from './AbstractHandler';
/**
 * Analytics handler for Matomo.
 */
export default class MatomoHandler extends AbstractHandler {
    _userProperties: Object;
    /**
     * Creates new instance of the Matomo handler.
     *
     * @param {Object} options - The matomo options.
     * @param {string} options.matomoEndpoint - The Matomo endpoint.
     * @param {string} options.matomoSiteID   - The site ID.
     */
    constructor(options: any);
    /**
     * Initializes the _paq object.
     *
     * @param {Object} options - The matomo options.
     * @param {string} options.matomoEndpoint - The Matomo endpoint.
     * @param {string} options.matomoSiteID   - The site ID.
     * @returns {void}
     */
    _initMatomo(options: any): void;
    /**
     * Extracts the integer to use for a Matomo event's value field
     * from a lib-jitsi-meet analytics event.
     *
     * @param {Object} event - The lib-jitsi-meet analytics event.
     * @returns {number} - The integer to use for the 'value' of a Matomo
     * event, or NaN if the lib-jitsi-meet event doesn't contain a
     * suitable value.
     * @private
     */
    _extractValue(event: IEvent): number;
    /**
     * Sets the permanent properties for the current session.
     *
     * @param {Object} userProps - The permanent properties.
     * @returns {void}
     */
    setUserProperties(userProps?: any): void;
    /**
     * This is the entry point of the API. The function sends an event to
     * the Matomo endpoint. The format of the event is described in
     * analyticsAdapter in lib-jitsi-meet.
     *
     * @param {Object} event - The event in the format specified by
     * lib-jitsi-meet.
     * @returns {void}
     */
    sendEvent(event: IEvent): void;
}
