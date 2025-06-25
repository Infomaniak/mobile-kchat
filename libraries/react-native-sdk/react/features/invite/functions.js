"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteSipEndpoints = exports.isSharingEnabled = exports.executeDialOutStatusRequest = exports.executeDialOutRequest = exports.getDefaultDialInNumber = exports.getConferenceId = exports._decodeRoomURI = exports._getDefaultPhoneNumber = exports.hasMultipleNumbers = exports.shouldDisplayDialIn = exports.getDialInfoPageURLForURIString = exports.getDialInfoPageURL = exports.getShareInfoText = exports.searchDirectory = exports.isSipInviteEnabled = exports.isDialOutEnabled = exports.isAddPeopleEnabled = exports.invitePeopleAndChatRooms = exports.getInviteTypeCounts = exports.getInviteText = exports.getInviteTextiOS = exports.getInviteResultsForQuery = exports.getDigitsOnly = exports.checkOutboundDestination = exports.checkDialNumber = exports.sharingFeatures = void 0;
const functions_1 = require("../base/conference/functions");
const functions_2 = require("../base/connection/functions");
const utils_1 = require("../base/environment/utils");
const i18next_1 = __importDefault(require("../base/i18n/i18next"));
const functions_3 = require("../base/jwt/functions");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const functions_4 = require("../base/participants/functions");
const functions_5 = require("../base/redux/functions");
const httpUtils_1 = require("../base/util/httpUtils");
const parseURLParams_1 = require("../base/util/parseURLParams");
const uri_1 = require("../base/util/uri");
const functions_6 = require("../jaas/functions");
const functions_7 = require("../recording/functions");
const _utils_1 = require("./_utils");
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
exports.sharingFeatures = {
    email: 'email',
    url: 'url',
    dialIn: 'dial-in',
    embed: 'embed'
};
/**
 * Sends an ajax request to check if the phone number can be called.
 *
 * @param {string} dialNumber - The dial number to check for validity.
 * @param {string} dialOutAuthUrl - The endpoint to use for checking validity.
 * @param {string} region - The region we are connected to.
 * @returns {Promise} - The promise created by the request.
 */
function checkDialNumber(dialNumber, dialOutAuthUrl, region) {
    const fullUrl = `${dialOutAuthUrl}?phone=${dialNumber}&region=${region}`;
    return new Promise((resolve, reject) => fetch(fullUrl)
        .then(res => {
        if (res.ok) {
            resolve(res.json());
        }
        else {
            reject(new Error('Request not successful!'));
        }
    })
        .catch(reject));
}
exports.checkDialNumber = checkDialNumber;
/**
 * Sends an ajax request to check if the outbound call is permitted.
 *
 * @param {string} dialOutRegionUrl - The config endpoint.
 * @param {string} jwt - The jwt token.
 * @param {string} appId - The customer id.
 * @param {string} phoneNumber - The destination phone number.
 * @returns {Promise} - The promise created by the request.
 */
function checkOutboundDestination(dialOutRegionUrl, jwt, appId, phoneNumber) {
    return (0, httpUtils_1.doGetJSON)(dialOutRegionUrl, true, {
        body: JSON.stringify({
            appId,
            phoneNumber
        }),
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        }
    });
}
exports.checkOutboundDestination = checkOutboundDestination;
/**
 * Removes all non-numeric characters from a string.
 *
 * @param {string} text - The string from which to remove all characters except
 * numbers.
 * @returns {string} A string with only numbers.
 */
function getDigitsOnly(text = '') {
    return text.replace(/\D/g, '');
}
exports.getDigitsOnly = getDigitsOnly;
/**
 * Combines directory search with phone number validation to produce a single
 * set of invite search results.
 *
 * @param {string} query - Text to search.
 * @param {GetInviteResultsOptions} options - Options to use when searching.
 * @returns {Promise<*>}
 */
function getInviteResultsForQuery(query, options) {
    const text = query.trim();
    const { addPeopleEnabled, appId, dialOutAuthUrl, dialOutRegionUrl, dialOutEnabled, peopleSearchQueryTypes, peopleSearchUrl, region, sipInviteEnabled, jwt } = options;
    let peopleSearchPromise;
    if (addPeopleEnabled && text) {
        peopleSearchPromise = searchDirectory(peopleSearchUrl, jwt, text, peopleSearchQueryTypes);
    }
    else {
        peopleSearchPromise = Promise.resolve([]);
    }
    let hasCountryCode = text.startsWith('+');
    let phoneNumberPromise;
    // Phone numbers are handled a specially to enable both cases of restricting
    // numbers to telephone number-y numbers and accepting any arbitrary string,
    // which may be valid for SIP (jigasi) calls. If the dialOutAuthUrl is
    // defined, then it is assumed the call is to a telephone number and
    // some validation of the number is completed, with the + sign used as a way
    // for the UI to detect and enforce the usage of a country code. If the
    // dialOutAuthUrl is not defined, accept anything because this is assumed
    // to be the SIP (jigasi) case.
    if (dialOutEnabled && dialOutAuthUrl && isMaybeAPhoneNumber(text)) {
        let numberToVerify = text;
        // When the number to verify does not start with a +, we assume no
        // proper country code has been entered. In such a case, prepend 1 for
        // the country code. The service currently takes care of prepending the
        // +.
        if (!hasCountryCode && !text.startsWith('1')) {
            numberToVerify = `1${numberToVerify}`;
        }
        // The validation service works properly when the query is digits only
        // so ensure only digits get sent.
        numberToVerify = getDigitsOnly(numberToVerify);
        phoneNumberPromise = checkDialNumber(numberToVerify, dialOutAuthUrl, region);
    }
    else if (dialOutEnabled && !dialOutAuthUrl) {
        // fake having a country code to hide the country code reminder
        hasCountryCode = true;
        // With no auth url, let's say the text is a valid number
        phoneNumberPromise = Promise.resolve({
            allow: true,
            country: '',
            phone: text
        });
    }
    else {
        phoneNumberPromise = Promise.resolve({});
    }
    return Promise.all([peopleSearchPromise, phoneNumberPromise])
        .then(async ([peopleResults, phoneResults]) => {
        const results = [
            ...peopleResults
        ];
        /**
         * This check for phone results is for the day the call to searching
         * people might return phone results as well. When that day comes
         * this check will make it so the server checks are honored and the
         * local appending of the number is not done. The local appending of
         * the phone number can then be cleaned up when convenient.
         */
        const hasPhoneResult = peopleResults.find(result => result.type === constants_1.INVITE_TYPES.PHONE);
        if (!hasPhoneResult && typeof phoneResults.allow === 'boolean') {
            const result = {
                allowed: phoneResults.allow,
                country: phoneResults.country,
                type: constants_1.INVITE_TYPES.PHONE,
                number: phoneResults.phone,
                originalEntry: text,
                showCountryCodeReminder: !hasCountryCode
            };
            if (!phoneResults.allow) {
                try {
                    const response = await checkOutboundDestination(dialOutRegionUrl, jwt, appId, text);
                    result.allowed = response.allowed;
                }
                catch (error) {
                    logger_1.default.error('Error checking permission to dial to outbound destination', error);
                }
            }
            results.push(result);
        }
        if (sipInviteEnabled && isASipAddress(text)) {
            results.push({
                type: constants_1.INVITE_TYPES.SIP,
                address: text
            });
        }
        return results;
    });
}
exports.getInviteResultsForQuery = getInviteResultsForQuery;
/**
 * Creates a custom no new lines message for iOS default mail describing how to dial in to the conference.
 *
 * @returns {string}
 */
function getInviteTextiOS({ state, phoneNumber, t }) {
    if (!(0, utils_1.isIosMobileBrowser)()) {
        return '';
    }
    const dialIn = state['features/invite'];
    const inviteUrl = (0, functions_2.getInviteURL)(state);
    const localParticipant = (0, functions_4.getLocalParticipant)(state);
    const localParticipantName = localParticipant?.name;
    const inviteURL = _decodeRoomURI(inviteUrl);
    let invite = localParticipantName
        ? t?.('info.inviteTextiOSPersonal', { name: localParticipantName })
        : t?.('info.inviteURLFirstPartGeneral');
    invite += ' ';
    invite += t?.('info.inviteTextiOSInviteUrl', { inviteUrl });
    invite += ' ';
    if (shouldDisplayDialIn(dialIn) && isSharingEnabled(exports.sharingFeatures.dialIn)) {
        invite += t?.('info.inviteTextiOSPhone', {
            number: phoneNumber,
            conferenceID: dialIn.conferenceID,
            didUrl: getDialInfoPageURL(state)
        });
    }
    invite += ' ';
    invite += t?.('info.inviteTextiOSJoinSilent', { silentUrl: `${inviteURL}#config.startSilent=true` });
    return invite;
}
exports.getInviteTextiOS = getInviteTextiOS;
/**
 * Creates a message describing how to dial in to the conference.
 *
 * @returns {string}
 */
function getInviteText({ state, phoneNumber, t }) {
    const dialIn = state['features/invite'];
    const inviteUrl = (0, functions_2.getInviteURL)(state);
    const currentLiveStreamingSession = (0, functions_7.getActiveSession)(state, lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM);
    const liveStreamViewURL = currentLiveStreamingSession?.liveStreamViewURL;
    const localParticipant = (0, functions_4.getLocalParticipant)(state);
    const localParticipantName = localParticipant?.name;
    const inviteURL = _decodeRoomURI(inviteUrl);
    let invite = localParticipantName
        ? t?.('info.inviteURLFirstPartPersonal', { name: localParticipantName })
        : t?.('info.inviteURLFirstPartGeneral');
    invite += t?.('info.inviteURLSecondPart', {
        url: inviteURL
    });
    if (liveStreamViewURL) {
        const liveStream = t?.('info.inviteLiveStream', {
            url: liveStreamViewURL
        });
        invite = `${invite}\n${liveStream}`;
    }
    if (shouldDisplayDialIn(dialIn) && isSharingEnabled(exports.sharingFeatures.dialIn)) {
        const dial = t?.('info.invitePhone', {
            number: phoneNumber,
            conferenceID: dialIn.conferenceID
        });
        const moreNumbers = t?.('info.invitePhoneAlternatives', {
            url: getDialInfoPageURL(state),
            silentUrl: `${inviteURL}#config.startSilent=true`
        });
        invite = `${invite}\n${dial}\n${moreNumbers}`;
    }
    return invite;
}
exports.getInviteText = getInviteText;
/**
 * Helper for determining how many of each type of user is being invited. Used
 * for logging and sending analytics related to invites.
 *
 * @param {Array} inviteItems - An array with the invite items, as created in
 * {@link _parseQueryResults}.
 * @returns {Object} An object with keys as user types and values as the number
 * of invites for that type.
 */
function getInviteTypeCounts(inviteItems = []) {
    const inviteTypeCounts = {};
    inviteItems.forEach(({ type }) => {
        if (!inviteTypeCounts[type]) {
            inviteTypeCounts[type] = 0;
        }
        inviteTypeCounts[type]++;
    });
    return inviteTypeCounts;
}
exports.getInviteTypeCounts = getInviteTypeCounts;
/**
 * Sends a post request to an invite service.
 *
 * @param {string} inviteServiceUrl - The invite service that generates the
 * invitation.
 * @param {string} inviteUrl - The url to the conference.
 * @param {string} jwt - The jwt token to pass to the search service.
 * @param {Immutable.List} inviteItems - The list of the "user" or "room" type
 * items to invite.
 * @returns {Promise} - The promise created by the request.
 */
function invitePeopleAndChatRooms(inviteServiceUrl, inviteUrl, jwt, inviteItems) {
    if (!inviteItems || inviteItems.length === 0) {
        return Promise.resolve();
    }
    const headers = {
        ...jwt ? { 'Authorization': `Bearer ${jwt}` } : {},
        'Content-Type': 'application/json'
    };
    return fetch(`${inviteServiceUrl}`, {
        body: JSON.stringify({
            'invited': inviteItems,
            'url': inviteUrl
        }),
        method: 'POST',
        headers
    });
}
exports.invitePeopleAndChatRooms = invitePeopleAndChatRooms;
/**
 * Determines if adding people is currently enabled.
 *
 * @param {IReduxState} state - Current state.
 * @returns {boolean} Indication of whether adding people is currently enabled.
 */
function isAddPeopleEnabled(state) {
    const { peopleSearchUrl } = state['features/base/config'];
    return Boolean(state['features/base/jwt'].jwt && Boolean(peopleSearchUrl) && !(0, functions_6.isVpaasMeeting)(state));
}
exports.isAddPeopleEnabled = isAddPeopleEnabled;
/**
 * Determines if dial out is currently enabled or not.
 *
 * @param {IReduxState} state - Current state.
 * @returns {boolean} Indication of whether dial out is currently enabled.
 */
function isDialOutEnabled(state) {
    const { conference } = state['features/base/conference'];
    return (0, functions_4.isLocalParticipantModerator)(state)
        && conference && conference.isSIPCallingSupported();
}
exports.isDialOutEnabled = isDialOutEnabled;
/**
 * Determines if inviting sip endpoints is enabled or not.
 *
 * @param {IReduxState} state - Current state.
 * @returns {boolean} Indication of whether sip invite is currently enabled.
 */
function isSipInviteEnabled(state) {
    const { sipInviteUrl } = state['features/base/config'];
    return (0, functions_4.isLocalParticipantModerator)(state)
        && (0, functions_3.isJwtFeatureEnabled)(state, 'sip-outbound-call')
        && Boolean(sipInviteUrl);
}
exports.isSipInviteEnabled = isSipInviteEnabled;
/**
 * Checks whether a string looks like it could be for a phone number.
 *
 * @param {string} text - The text to check whether or not it could be a phone
 * number.
 * @private
 * @returns {boolean} True if the string looks like it could be a phone number.
 */
function isMaybeAPhoneNumber(text) {
    if (!isPhoneNumberRegex().test(text)) {
        return false;
    }
    const digits = getDigitsOnly(text);
    return Boolean(digits.length);
}
/**
 * Checks whether a string matches a sip address format.
 *
 * @param {string} text - The text to check.
 * @returns {boolean} True if provided text matches a sip address format.
 */
function isASipAddress(text) {
    return constants_1.SIP_ADDRESS_REGEX.test(text);
}
/**
 * RegExp to use to determine if some text might be a phone number.
 *
 * @returns {RegExp}
 */
function isPhoneNumberRegex() {
    let regexString = '^[0-9+()-\\s]*$';
    if (typeof interfaceConfig !== 'undefined') {
        regexString = interfaceConfig.PHONE_NUMBER_REGEX || regexString;
    }
    return new RegExp(regexString);
}
/**
 * Sends an ajax request to a directory service.
 *
 * @param {string} serviceUrl - The service to query.
 * @param {string} jwt - The jwt token to pass to the search service.
 * @param {string} text - Text to search.
 * @param {Array<string>} queryTypes - Array with the query types that will be
 * executed - "conferenceRooms" | "user" | "room".
 * @returns {Promise} - The promise created by the request.
 */
function searchDirectory(// eslint-disable-line max-params
serviceUrl, jwt, text, queryTypes = ['conferenceRooms', 'user', 'room']) {
    const query = encodeURIComponent(text);
    const queryTypesString = encodeURIComponent(JSON.stringify(queryTypes));
    const headers = {
        ...jwt ? { 'Authorization': `Bearer ${jwt}` } : {}
    };
    return fetch(`${serviceUrl}?query=${query}&queryTypes=${queryTypesString}`, {
        method: 'GET',
        headers
    })
        .then(response => {
        const jsonify = response.json();
        if (response.ok) {
            return jsonify;
        }
        return jsonify
            .then(result => Promise.reject(result));
    })
        .catch(error => {
        logger_1.default.error('Error searching directory:', error);
        return Promise.reject(error);
    });
}
exports.searchDirectory = searchDirectory;
/**
 * Returns descriptive text that can be used to invite participants to a meeting
 * (share via mobile or use it for calendar event description).
 *
 * @param {IReduxState} state - The current state.
 * @param {string} inviteUrl - The conference/location URL.
 * @param {boolean} useHtml - Whether to return html text.
 * @param {boolean} skipDialIn - Whether to skip dial-in options or not.
 * @returns {Promise<string>} A {@code Promise} resolving with a
 * descriptive text that can be used to invite participants to a meeting.
 */
function getShareInfoText(state, inviteUrl, useHtml, skipDialIn) {
    let roomUrl = _decodeRoomURI(inviteUrl);
    if (useHtml) {
        roomUrl = `<a href="${roomUrl}">${roomUrl}</a>`;
    }
    let infoText = i18next_1.default.t('share.mainText', { roomUrl });
    const { room } = (0, uri_1.parseURIString)(inviteUrl);
    const { dialInConfCodeUrl, dialInNumbersUrl, hosts } = state['features/base/config'];
    const { locationURL = {} } = state['features/base/connection'];
    const mucURL = hosts?.muc;
    if (skipDialIn || !dialInConfCodeUrl || !dialInNumbersUrl || !mucURL) {
        // URLs for fetching dial in numbers not defined.
        return Promise.resolve(infoText);
    }
    let hasPaymentError = false;
    // We are requesting numbers and conferenceId directly
    // not using updateDialInNumbers, because custom room
    // is specified and we do not want to store the data
    // in the state.
    const numbersPromise = Promise.all([
        (0, _utils_1.getDialInNumbers)(dialInNumbersUrl, room, mucURL),
        (0, _utils_1.getDialInConferenceID)(dialInConfCodeUrl, room, mucURL, locationURL)
    ]).then(([numbers, { conference, id, message }]) => {
        if (!conference || !id) {
            return Promise.reject(message);
        }
        return {
            numbers,
            conferenceID: id
        };
    });
    return numbersPromise.then(({ conferenceID, numbers }) => {
        const phoneNumber = _getDefaultPhoneNumber(numbers) || '';
        return `${i18next_1.default.t('info.dialInNumber')} ${phoneNumber} ${i18next_1.default.t('info.dialInConferenceID')} ${conferenceID}#\n\n`;
    })
        .catch(error => {
        logger_1.default.error('Error fetching numbers or conferenceID', error);
        hasPaymentError = error?.status === uri_1.StatusCode.PaymentRequired;
    })
        .then(defaultDialInNumber => {
        if (hasPaymentError) {
            infoText += `${i18next_1.default.t('info.dialInNumber')} ${i18next_1.default.t('info.reachedLimit')} ${i18next_1.default.t('info.upgradeOptions')} ${constants_1.UPGRADE_OPTIONS_TEXT}`;
            return infoText;
        }
        let dialInfoPageUrl = getDialInfoPageURL(state, room);
        if (useHtml) {
            dialInfoPageUrl = `<a href="${dialInfoPageUrl}">${dialInfoPageUrl}</a>`;
        }
        infoText += i18next_1.default.t('share.dialInfoText', {
            defaultDialInNumber,
            dialInfoPageUrl
        });
        return infoText;
    });
}
exports.getShareInfoText = getShareInfoText;
/**
 * Generates the URL for the static dial in info page.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @param {string?} roomName - The conference name. Optional name, if missing will be extracted from state.
 * @returns {string}
 */
function getDialInfoPageURL(state, roomName) {
    const { didPageUrl } = state['features/dynamic-branding'];
    const conferenceName = roomName ?? (0, functions_1.getRoomName)(state);
    const { locationURL } = state['features/base/connection'];
    const { href = '' } = locationURL ?? {};
    const room = _decodeRoomURI(conferenceName ?? '');
    const url = didPageUrl || `${href.substring(0, href.lastIndexOf('/'))}/${constants_1.DIAL_IN_INFO_PAGE_PATH_NAME}`;
    return (0, uri_1.appendURLParam)(url, 'room', room);
}
exports.getDialInfoPageURL = getDialInfoPageURL;
/**
 * Generates the URL for the static dial in info page.
 *
 * @param {string} uri - The conference URI string.
 * @returns {string}
 */
function getDialInfoPageURLForURIString(uri) {
    if (!uri) {
        return undefined;
    }
    const { protocol, host, contextRoot, room } = (0, uri_1.parseURIString)(uri);
    let url = `${protocol}//${host}${contextRoot}${constants_1.DIAL_IN_INFO_PAGE_PATH_NAME}`;
    url = (0, uri_1.appendURLParam)(url, 'room', room);
    const { release } = (0, parseURLParams_1.parseURLParams)(uri, true, 'search');
    release && (url = (0, uri_1.appendURLParam)(url, 'release', release));
    return url;
}
exports.getDialInfoPageURLForURIString = getDialInfoPageURLForURIString;
/**
 * Returns whether or not dial-in related UI should be displayed.
 *
 * @param {Object} dialIn - Dial in information.
 * @returns {boolean}
 */
function shouldDisplayDialIn(dialIn) {
    const { conferenceID, numbers, numbersEnabled } = dialIn;
    const phoneNumber = _getDefaultPhoneNumber(numbers);
    return Boolean(conferenceID
        && numbers
        && numbersEnabled
        && phoneNumber);
}
exports.shouldDisplayDialIn = shouldDisplayDialIn;
/**
 * Returns if multiple dial-in numbers are available.
 *
 * @param {Array<string>|Object} dialInNumbers - The array or object of
 * numbers to check.
 * @private
 * @returns {boolean}
 */
function hasMultipleNumbers(dialInNumbers) {
    if (!dialInNumbers) {
        return false;
    }
    if (Array.isArray(dialInNumbers)) {
        return dialInNumbers.length > 1;
    }
    // deprecated and will be removed
    const { numbers } = dialInNumbers;
    // eslint-disable-next-line no-confusing-arrow
    return Boolean(numbers && Object.values(numbers).map(a => Array.isArray(a) ? a.length : 0)
        .reduce((a, b) => a + b) > 1);
}
exports.hasMultipleNumbers = hasMultipleNumbers;
/**
 * Sets the internal state of which dial-in number to display.
 *
 * @param {Array<string>|Object} dialInNumbers - The array or object of
 * numbers to choose a number from.
 * @private
 * @returns {string|null}
 */
function _getDefaultPhoneNumber(dialInNumbers) {
    if (!dialInNumbers) {
        return null;
    }
    if (Array.isArray(dialInNumbers)) {
        // new syntax follows
        // find the default country inside dialInNumbers, US one
        // or return the first one
        const defaultNumber = dialInNumbers.find(number => number.default);
        if (defaultNumber) {
            return defaultNumber.formattedNumber;
        }
        return dialInNumbers.length > 0
            ? dialInNumbers[0].formattedNumber : null;
    }
    const { numbers } = dialInNumbers;
    if (numbers && Object.keys(numbers).length > 0) {
        // deprecated and will be removed
        const firstRegion = Object.keys(numbers)[0];
        return firstRegion && numbers[firstRegion][0];
    }
    return null;
}
exports._getDefaultPhoneNumber = _getDefaultPhoneNumber;
/**
 * Decodes URI only if doesn't contain a space(' ').
 *
 * @param {string} url - The string to decode.
 * @returns {string} - It the string contains space, encoded value is '%20' returns
 * same string, otherwise decoded one.
 * @private
 */
function _decodeRoomURI(url) {
    let roomUrl = url;
    // we want to decode urls when the do not contain space, ' ', which url encoded is %20
    if (roomUrl && !roomUrl.includes('%20')) {
        roomUrl = decodeURI(roomUrl);
    }
    // Handles a special case where the room name has % encoded, the decoded will have
    // % followed by a char (non-digit) which is not a valid URL and room name ... so we do not
    // want to show this decoded
    if (roomUrl.match(/.*%[^\d].*/)) {
        return url;
    }
    return roomUrl;
}
exports._decodeRoomURI = _decodeRoomURI;
/**
 * Returns the stored conference id.
 *
 * @param {IStateful} stateful - The Object or Function that can be
 * resolved to a Redux state object with the toState function.
 * @returns {string}
 */
function getConferenceId(stateful) {
    return (0, functions_5.toState)(stateful)['features/invite'].conferenceID;
}
exports.getConferenceId = getConferenceId;
/**
 * Returns the default dial in number from the store.
 *
 * @param {IStateful} stateful - The Object or Function that can be
 * resolved to a Redux state object with the toState function.
 * @returns {string | null}
 */
function getDefaultDialInNumber(stateful) {
    // @ts-ignore
    return _getDefaultPhoneNumber((0, functions_5.toState)(stateful)['features/invite'].numbers);
}
exports.getDefaultDialInNumber = getDefaultDialInNumber;
/**
 * Executes the dial out request.
 *
 * @param {string} url - The url for dialing out.
 * @param {Object} body - The body of the request.
 * @param {string} reqId - The unique request id.
 * @returns {Object}
 */
async function executeDialOutRequest(url, body, reqId) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'request-id': reqId
        },
        body: JSON.stringify(body)
    });
    const json = await res.json();
    return res.ok ? json : Promise.reject(json);
}
exports.executeDialOutRequest = executeDialOutRequest;
/**
 * Executes the dial out status request.
 *
 * @param {string} url - The url for dialing out.
 * @param {string} reqId - The unique request id used on the dial out request.
 * @returns {Object}
 */
async function executeDialOutStatusRequest(url, reqId) {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'request-id': reqId
        }
    });
    const json = await res.json();
    return res.ok ? json : Promise.reject(json);
}
exports.executeDialOutStatusRequest = executeDialOutStatusRequest;
/**
 * Returns true if a specific sharing feature is enabled in interface configuration.
 *
 * @param {string} sharingFeature - The sharing feature to check.
 * @returns {boolean}
 */
function isSharingEnabled(sharingFeature) {
    return typeof interfaceConfig === 'undefined'
        || typeof interfaceConfig.SHARING_FEATURES === 'undefined'
        || (interfaceConfig.SHARING_FEATURES.length && interfaceConfig.SHARING_FEATURES.indexOf(sharingFeature) > -1);
}
exports.isSharingEnabled = isSharingEnabled;
/**
 * Sends a post request to an invite service.
 *
 * @param {Array} inviteItems - The list of the "sip" type items to invite.
 * @param {URL} locationURL - The URL of the location.
 * @param {string} sipInviteUrl - The invite service that generates the invitation.
 * @param {string} jwt - The jwt token.
 * @param {string} roomName - The name to the conference.
 * @param {string} roomPassword - The password of the conference.
 * @param {string} displayName - The user display name.
 * @returns {Promise} - The promise created by the request.
 */
function inviteSipEndpoints(// eslint-disable-line max-params
inviteItems, locationURL, sipInviteUrl, jwt, roomName, roomPassword, displayName) {
    if (inviteItems.length === 0) {
        return Promise.resolve();
    }
    const regex = new RegExp(`/${roomName}`, 'i');
    const baseUrl = Object.assign(new URL(locationURL.toString()), {
        pathname: locationURL.pathname.replace(regex, ''),
        hash: '',
        search: ''
    });
    return fetch(sipInviteUrl, {
        body: JSON.stringify({
            callParams: {
                callUrlInfo: {
                    baseUrl,
                    callName: roomName
                },
                passcode: roomPassword
            },
            sipClientParams: {
                displayName,
                sipAddress: inviteItems.map(item => item.address)
            }
        }),
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        }
    });
}
exports.inviteSipEndpoints = inviteSipEndpoints;
