"use strict";
/**
 * Utility class with no dependencies. Used in components that are stripped in separate bundles
 * and requires as less dependencies as possible.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDialInNumbers = exports.getDialInConferenceID = exports._formatConferenceIDPin = void 0;
const utils_1 = require("../base/connection/utils");
const httpUtils_1 = require("../base/util/httpUtils");
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
function _formatConferenceIDPin(conferenceID) {
    const conferenceIDStr = conferenceID.toString();
    // let's split the conferenceID in 3 parts, to be easier to read
    const partLen = Math.ceil(conferenceIDStr.length / 3);
    return `${conferenceIDStr.substring(0, partLen)} ${conferenceIDStr.substring(partLen, 2 * partLen)} ${conferenceIDStr.substring(2 * partLen, conferenceIDStr.length)}`;
}
exports._formatConferenceIDPin = _formatConferenceIDPin;
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
function getDialInConferenceID(baseUrl, roomName, mucURL, url) {
    const separator = baseUrl.includes('?') ? '&' : '?';
    const conferenceIDURL = `${baseUrl}${separator}conference=${roomName}@${mucURL}&url=${(0, utils_1.getURLWithoutParams)(url).href}`;
    return (0, httpUtils_1.doGetJSON)(conferenceIDURL, true);
}
exports.getDialInConferenceID = getDialInConferenceID;
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
function getDialInNumbers(url, roomName, mucURL) {
    const separator = url.includes('?') ? '&' : '?';
    // when roomName and mucURL are available
    // provide conference when looking up dial in numbers
    return (0, httpUtils_1.doGetJSON)(url + (roomName && mucURL ? `${separator}conference=${roomName}@${mucURL}` : ''), true);
}
exports.getDialInNumbers = getDialInNumbers;
