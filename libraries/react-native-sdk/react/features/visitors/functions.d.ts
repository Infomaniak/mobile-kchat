import { IReduxState } from '../app/types';
import { IStateful } from '../base/app/types';
/**
 * A short string to represent the number of visitors.
 * Over 100 we show numbers like 0.2 K or 9.5 K.
 *
 * @param {number} visitorsCount - The number of visitors to shorten.
 *
 * @returns {string} Short string representing the number of visitors.
 */
export declare function getVisitorsShortText(visitorsCount: number): string;
/**
 * Selector to return a list of promotion requests from visitors.
 *
 * @param {IReduxState} state - State object.
 * @returns {Array<Object>}
 */
export declare function getPromotionRequests(state: IReduxState): import("./types").IPromotionRequest[];
/**
 * Whether current UI is in visitor mode.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {boolean} Whether iAmVisitor is set.
 */
export declare function iAmVisitor(stateful: IStateful): boolean;
/**
 * Returns the number of visitors.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {number} - The number of visitors.
 */
export declare function getVisitorsCount(stateful: IStateful): number;
