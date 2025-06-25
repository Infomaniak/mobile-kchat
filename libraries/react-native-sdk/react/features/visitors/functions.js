"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitorsCount = exports.iAmVisitor = exports.getPromotionRequests = exports.getVisitorsShortText = void 0;
const functions_1 = require("../base/redux/functions");
/**
 * A short string to represent the number of visitors.
 * Over 100 we show numbers like 0.2 K or 9.5 K.
 *
 * @param {number} visitorsCount - The number of visitors to shorten.
 *
 * @returns {string} Short string representing the number of visitors.
 */
function getVisitorsShortText(visitorsCount) {
    return visitorsCount > 100 ? `${Math.round(visitorsCount / 100) / 10} K` : String(visitorsCount);
}
exports.getVisitorsShortText = getVisitorsShortText;
/**
 * Selector to return a list of promotion requests from visitors.
 *
 * @param {IReduxState} state - State object.
 * @returns {Array<Object>}
 */
function getPromotionRequests(state) {
    return state['features/visitors'].promotionRequests;
}
exports.getPromotionRequests = getPromotionRequests;
/**
 * Whether current UI is in visitor mode.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {boolean} Whether iAmVisitor is set.
 */
function iAmVisitor(stateful) {
    return (0, functions_1.toState)(stateful)['features/visitors'].iAmVisitor;
}
exports.iAmVisitor = iAmVisitor;
/**
 * Returns the number of visitors.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {number} - The number of visitors.
 */
function getVisitorsCount(stateful) {
    return (0, functions_1.toState)(stateful)['features/visitors'].count ?? 0;
}
exports.getVisitorsCount = getVisitorsCount;
