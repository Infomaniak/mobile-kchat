import { IReduxState } from '../../app/types';
/**
 * Retrieves the JSON Web Token (JWT), if any, defined by a specific
 * {@link URL}.
 *
 * @param {URL} url - The {@code URL} to parse and retrieve the JSON Web Token
 * (JWT), if any, from.
 * @returns {string} The JSON Web Token (JWT), if any, defined by the specified
 * {@code url}; otherwise, {@code undefined}.
 */
export declare function parseJWTFromURLParams(url?: URL | typeof window.location): any;
/**
 * Returns the user name after decoding the jwt.
 *
 * @param {IReduxState} state - The app state.
 * @returns {string}
 */
export declare function getJwtName(state: IReduxState): string | undefined;
/**
 * Check if the given JWT feature is enabled.
 *
 * @param {IReduxState} state - The app state.
 * @param {string} feature - The feature we want to check.
 * @param {boolean} ifNoToken - Default value if there is no token.
 * @param {boolean} ifNotInFeatures - Default value if features prop exists but does not have the {@code feature}.
 * @returns {bolean}
 */
export declare function isJwtFeatureEnabled(state: IReduxState, feature: string, ifNoToken?: boolean, ifNotInFeatures?: boolean): boolean;
/**
 * Returns a list with all validation errors for the given jwt.
 *
 * @param {string} jwt - The jwt.
 * @returns {Array} - An array containing all jwt validation errors.
 */
export declare function validateJwt(jwt: string): Object[];
/**
 * Extracts and returns the expiration date of jwt.
 *
 * @param {string|undefined} jwt - The jwt to check.
 * @returns {Date} The expiration date of the jwt.
 */
export declare function getJwtExpirationDate(jwt: string | undefined): Date | undefined;
