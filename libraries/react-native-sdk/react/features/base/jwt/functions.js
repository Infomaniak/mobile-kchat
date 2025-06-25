"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtExpirationDate = exports.validateJwt = exports.isJwtFeatureEnabled = exports.getJwtName = exports.parseJWTFromURLParams = void 0;
// @ts-expect-error
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const functions_1 = require("../participants/functions");
const parseURLParams_1 = require("../util/parseURLParams");
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
/**
 * Retrieves the JSON Web Token (JWT), if any, defined by a specific
 * {@link URL}.
 *
 * @param {URL} url - The {@code URL} to parse and retrieve the JSON Web Token
 * (JWT), if any, from.
 * @returns {string} The JSON Web Token (JWT), if any, defined by the specified
 * {@code url}; otherwise, {@code undefined}.
 */
function parseJWTFromURLParams(url = window.location) {
    // @ts-ignore
    const jwt = (0, parseURLParams_1.parseURLParams)(url, false, 'hash').jwt;
    // TODO: eventually remove the search param and only pull from the hash
    // @ts-ignore
    return jwt ? jwt : (0, parseURLParams_1.parseURLParams)(url, true, 'search').jwt;
}
exports.parseJWTFromURLParams = parseJWTFromURLParams;
/**
 * Returns the user name after decoding the jwt.
 *
 * @param {IReduxState} state - The app state.
 * @returns {string}
 */
function getJwtName(state) {
    const { user } = state['features/base/jwt'];
    return user?.name;
}
exports.getJwtName = getJwtName;
/**
 * Check if the given JWT feature is enabled.
 *
 * @param {IReduxState} state - The app state.
 * @param {string} feature - The feature we want to check.
 * @param {boolean} ifNoToken - Default value if there is no token.
 * @param {boolean} ifNotInFeatures - Default value if features prop exists but does not have the {@code feature}.
 * @returns {bolean}
 */
function isJwtFeatureEnabled(state, feature, ifNoToken = false, ifNotInFeatures = false) {
    const { jwt } = state['features/base/jwt'];
    if (!jwt) {
        return ifNoToken;
    }
    const { features } = (0, functions_1.getLocalParticipant)(state) || {};
    // If `features` is undefined, act as if everything is enabled.
    if (typeof features === 'undefined') {
        return true;
    }
    if (typeof features[feature] === 'undefined') {
        return ifNotInFeatures;
    }
    return String(features[feature]) === 'true';
}
exports.isJwtFeatureEnabled = isJwtFeatureEnabled;
/**
 * Checks whether a given timestamp is a valid UNIX timestamp in seconds.
 * We convert to milliseconds during the check since `Date` works with milliseconds for UNIX timestamp values.
 *
 * @param {any} timestamp - A UNIX timestamp in seconds as stored in the jwt.
 * @returns {boolean} - Whether the timestamp is indeed a valid UNIX timestamp or not.
 */
function isValidUnixTimestamp(timestamp) {
    return typeof timestamp === 'number' && timestamp * 1000 === new Date(timestamp * 1000).getTime();
}
/**
 * Returns a list with all validation errors for the given jwt.
 *
 * @param {string} jwt - The jwt.
 * @returns {Array} - An array containing all jwt validation errors.
 */
function validateJwt(jwt) {
    const errors = [];
    const currentTimestamp = new Date().getTime();
    try {
        const header = (0, jwt_decode_1.default)(jwt, { header: true });
        const payload = (0, jwt_decode_1.default)(jwt);
        if (!header) {
            errors.push({ key: constants_1.JWT_VALIDATION_ERRORS.HEADER_NOT_FOUND });
            return errors;
        }
        if (!payload) {
            errors.push({ key: constants_1.JWT_VALIDATION_ERRORS.PAYLOAD_NOT_FOUND });
            return errors;
        }
        const { aud, context, exp, iss, nbf, sub } = payload;
        // JaaS only
        if (sub?.startsWith('vpaas-magic-cookie')) {
            const { kid } = header;
            // if Key ID is missing, we return the error immediately without further validations.
            if (!kid) {
                errors.push({ key: constants_1.JWT_VALIDATION_ERRORS.KID_NOT_FOUND });
                return errors;
            }
            if (kid.substring(0, kid.indexOf('/')) !== sub) {
                errors.push({ key: constants_1.JWT_VALIDATION_ERRORS.KID_MISMATCH });
            }
            if (aud !== 'jitsi') {
                errors.push({ key: constants_1.JWT_VALIDATION_ERRORS.AUD_INVALID });
            }
            if (iss !== 'chat') {
                errors.push({ key: constants_1.JWT_VALIDATION_ERRORS.ISS_INVALID });
            }
            if (!context?.features) {
                errors.push({ key: constants_1.JWT_VALIDATION_ERRORS.FEATURES_NOT_FOUND });
            }
        }
        if (!isValidUnixTimestamp(nbf)) {
            errors.push({ key: constants_1.JWT_VALIDATION_ERRORS.NBF_INVALID });
        }
        else if (currentTimestamp < nbf * 1000) {
            errors.push({ key: constants_1.JWT_VALIDATION_ERRORS.NBF_FUTURE });
        }
        if (!isValidUnixTimestamp(exp)) {
            errors.push({ key: constants_1.JWT_VALIDATION_ERRORS.EXP_INVALID });
        }
        else if (currentTimestamp > exp * 1000) {
            errors.push({ key: constants_1.JWT_VALIDATION_ERRORS.TOKEN_EXPIRED });
        }
        if (!context) {
            errors.push({ key: constants_1.JWT_VALIDATION_ERRORS.CONTEXT_NOT_FOUND });
        }
        else if (context.features) {
            const { features } = context;
            const meetFeatures = Object.values(constants_1.MEET_FEATURES);
            Object.keys(features).forEach(feature => {
                if (meetFeatures.includes(feature)) {
                    const featureValue = features[feature];
                    // cannot use truthy or falsy because we need the exact value and type check.
                    if (featureValue !== true
                        && featureValue !== false
                        && featureValue !== 'true'
                        && featureValue !== 'false') {
                        errors.push({
                            key: constants_1.JWT_VALIDATION_ERRORS.FEATURE_VALUE_INVALID,
                            args: { feature }
                        });
                    }
                }
                else {
                    errors.push({
                        key: constants_1.JWT_VALIDATION_ERRORS.FEATURE_INVALID,
                        args: { feature }
                    });
                }
            });
        }
    }
    catch (e) {
        logger_1.default.error(`Unspecified JWT error${e?.message ? `: ${e.message}` : ''}`);
    }
    return errors;
}
exports.validateJwt = validateJwt;
/**
 * Extracts and returns the expiration date of jwt.
 *
 * @param {string|undefined} jwt - The jwt to check.
 * @returns {Date} The expiration date of the jwt.
 */
function getJwtExpirationDate(jwt) {
    if (!jwt) {
        return;
    }
    const payload = (0, jwt_decode_1.default)(jwt);
    if (payload) {
        const { exp } = payload;
        return new Date(exp * 1000);
    }
}
exports.getJwtExpirationDate = getJwtExpirationDate;
