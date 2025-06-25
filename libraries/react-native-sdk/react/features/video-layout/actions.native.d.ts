export * from './actions.any';
/**
 * Creates a (redux) action which tells whether we are in carmode.
 *
 * @param {boolean} enabled - Whether we are in carmode.
 * @returns {{
 *     type: SET_CAR_MODE,
 *    enabled: boolean
 * }}
 */
export declare function setIsCarmode(enabled: boolean): {
    type: string;
    enabled: boolean;
};
