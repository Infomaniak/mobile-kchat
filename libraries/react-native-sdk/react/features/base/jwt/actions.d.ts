/**
 * Stores a specific JSON Web Token (JWT) into the redux store.
 *
 * @param {string} [jwt] - The JSON Web Token (JWT) to store.
 * @returns {{
 *     type: SET_TOKEN_DATA,
 *     jwt: (string|undefined)
 * }}
 */
export declare function setJWT(jwt?: string): {
    type: string;
    jwt: string | undefined;
};
