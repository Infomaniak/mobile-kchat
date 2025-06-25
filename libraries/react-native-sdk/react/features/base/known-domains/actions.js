"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addKnownDomains = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Creates a (redux) action to add known domains to the list of domains known to
 * the feature base/known-domains.
 *
 * @param {string | Array<string>} knownDomains - The known domain(s) to add to
 * the list of domains known to the feature base/known-domains.
 * @returns {{
 *     type: ADD_KNOWN_DOMAINS,
 *     knownDomains: Array<string>
 * }}
 */
function addKnownDomains(knownDomains) {
    return {
        type: actionTypes_1.ADD_KNOWN_DOMAINS,
        knownDomains: typeof knownDomains === 'string' ? [knownDomains] : knownDomains
    };
}
exports.addKnownDomains = addKnownDomains;
