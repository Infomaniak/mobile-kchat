/**
 * Utility class with no dependencies. Used in components that are stripped in separate bundles
 * and requires as less dependencies as possible.
 */
/**
 * Formats the conference pin in readable way for UI to display it.
 * Formats the pin in 3 groups of digits:
 * XXXX XXXX XX or XXXXX XXXXX XXX.
 * The length of first and second group is Math.ceil(pin.length / 3).
 *
 * @param {Object} conferenceID - The conference id to format, string or number.
 * @returns {string} - The formatted conference pin.
 * @private
 */
export declare function _formatConferenceIDPin(conferenceID: Object): string;
/**
 * Sends a GET request to obtain the conference ID necessary for identifying
 * which conference to join after dialing the dial-in service.
 * This function is used not only in the main app bundle but in separate bundles for the dial in numbers page,
 * and we do want to limit the dependencies.
 *
 * @param {string} baseUrl - The url for obtaining the conference ID (pin) for
 * dialing into a conference.
 * @param {string} roomName - The conference name to find the associated
 * conference ID.
 * @param {string} mucURL - In which MUC the conference exists.
 * @param {URL} url - The address we are loaded in.
 * @returns {Promise} - The promise created by the request.
 */
export declare function getDialInConferenceID(baseUrl: string, roomName: string, mucURL: string, url: URL): Promise<any>;
/**
 * Sends a GET request for phone numbers used to dial into a conference.
 * This function is used not only in the main app bundle but in separate bundles for the dial in numbers page,
 * and we do want to limit the dependencies.
 *
 * @param {string} url - The service that returns conference dial-in numbers.
 * @param {string} roomName - The conference name to find the associated
 * conference ID.
 * @param {string} mucURL - In which MUC the conference exists.
 * @returns {Promise} - The promise created by the request. The returned numbers
 * may be an array of Objects containing numbers, with keys countryCode,
 * tollFree, formattedNumber or an object with countries as keys and arrays of
 * phone number strings, as the second one should not be used and is deprecated.
 */
export declare function getDialInNumbers(url: string, roomName: string, mucURL: string): Promise<any>;
