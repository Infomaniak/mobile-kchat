export interface IEvent {
    action?: string;
    actionSubject?: string;
    attributes?: {
        [key: string]: string | undefined;
    };
    name?: string;
    source?: string;
    type?: string;
}
interface IOptions {
    amplitudeAPPKey?: string;
    amplitudeIncludeUTM?: boolean;
    blackListedEvents?: string[];
    envType?: string;
    googleAnalyticsTrackingId?: string;
    group?: string;
    host?: string;
    matomoEndpoint?: string;
    matomoSiteID?: string;
    product?: string;
    subproduct?: string;
    user?: string;
    version?: string;
    whiteListedEvents?: string[];
}
/**
 * Abstract implementation of analytics handler.
 */
export default class AbstractHandler {
    _enabled: boolean;
    _whiteListedEvents: Array<string> | undefined;
    _blackListedEvents: Array<string> | undefined;
    /**
     * Creates new instance.
     *
     * @param {Object} options - Optional parameters.
     */
    constructor(options?: IOptions);
    /**
     * Extracts a name for the event from the event properties.
     *
     * @param {Object} event - The analytics event.
     * @returns {string} - The extracted name.
     */
    _extractName(event: IEvent): string | undefined;
    /**
     * Checks if an event should be ignored or not.
     *
     * @param {Object} event - The event.
     * @returns {boolean}
     */
    _shouldIgnore(event: IEvent): boolean;
}
export {};
