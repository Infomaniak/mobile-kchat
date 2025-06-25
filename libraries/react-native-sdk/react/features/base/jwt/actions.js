"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setJWT = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Stores a specific JSON Web Token (JWT) into the redux store.
 *
 * @param {string} [jwt] - The JSON Web Token (JWT) to store.
 * @returns {{
 *     type: SET_TOKEN_DATA,
 *     jwt: (string|undefined)
 * }}
 */
function setJWT(jwt) {
    return {
        type: actionTypes_1.SET_JWT,
        jwt
    };
}
exports.setJWT = setJWT;
