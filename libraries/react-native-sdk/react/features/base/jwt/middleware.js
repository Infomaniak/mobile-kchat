"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const actionTypes_1 = require("../config/actionTypes");
const actionTypes_2 = require("../connection/actionTypes");
const actions_1 = require("../participants/actions");
const functions_1 = require("../participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actionTypes_3 = require("./actionTypes");
const actions_2 = require("./actions");
const functions_2 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Middleware to parse token data upon setting a new room URL.
 *
 * @param {Store} store - The redux store.
 * @private
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.SET_CONFIG:
        case actionTypes_2.SET_LOCATION_URL:
            // XXX The JSON Web Token (JWT) is not the only piece of state that we
            // have decided to store in the feature jwt
            return _setConfigOrLocationURL(store, next, action);
        case actionTypes_3.SET_JWT:
            return _setJWT(store, next, action);
    }
    return next(action);
});
/**
 * Overwrites the properties {@code avatarURL}, {@code email}, and {@code name}
 * of the local participant stored in the redux state base/participants.
 *
 * @param {Store} store - The redux store.
 * @param {Object} localParticipant - The {@code Participant} structure to
 * overwrite the local participant stored in the redux store base/participants
 * with.
 * @private
 * @returns {void}
 */
function _overwriteLocalParticipant({ dispatch, getState }, { avatarURL, email, id: jwtId, name, features }) {
    let localParticipant;
    if ((avatarURL || email || name || features) && (localParticipant = (0, functions_1.getLocalParticipant)(getState))) {
        const newProperties = {
            id: localParticipant.id,
            local: true
        };
        if (avatarURL) {
            newProperties.avatarURL = avatarURL;
        }
        if (email) {
            newProperties.email = email;
        }
        if (jwtId) {
            newProperties.jwtId = jwtId;
        }
        if (name) {
            newProperties.name = name;
        }
        if (features) {
            newProperties.features = features;
        }
        dispatch((0, actions_1.participantUpdated)(newProperties));
    }
}
/**
 * Notifies the feature jwt that the action {@link SET_CONFIG} or
 * {@link SET_LOCATION_URL} is being dispatched within a specific redux
 * {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux dispatch function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code SET_CONFIG} or
 * {@code SET_LOCATION_URL} which is being dispatched in the specified
 * {@code store}.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified {@code action}.
 */
function _setConfigOrLocationURL({ dispatch, getState }, next, action) {
    const result = next(action);
    const { locationURL } = getState()['features/base/connection'];
    dispatch((0, actions_2.setJWT)(locationURL ? (0, functions_2.parseJWTFromURLParams)(locationURL) : undefined));
    return result;
}
/**
 * Notifies the feature jwt that the action {@link SET_JWT} is being dispatched
 * within a specific redux {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux dispatch function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code SET_JWT} which is being
 * dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified {@code action}.
 */
function _setJWT(store, next, action) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { jwt, type, ...actionPayload } = action;
    if (!Object.keys(actionPayload).length) {
        if (jwt) {
            let jwtPayload;
            try {
                jwtPayload = (0, jwt_decode_1.default)(jwt);
            }
            catch (e) {
                logger_1.default.error(e);
            }
            if (jwtPayload) {
                const { context, iss, sub } = jwtPayload;
                action.jwt = jwt;
                action.issuer = iss;
                if (context) {
                    const user = _user2participant(context.user || {});
                    action.callee = context.callee;
                    action.group = context.group;
                    action.server = context.server;
                    action.tenant = context.tenant || sub || undefined;
                    action.user = user;
                    const newUser = user ? { ...user } : {};
                    _overwriteLocalParticipant(store, { ...newUser,
                        features: context.features });
                    // eslint-disable-next-line max-depth
                    if (context.user && context.user.role === 'visitor') {
                        action.preferVisitor = true;
                    }
                }
                else if (jwtPayload.name || jwtPayload.picture || jwtPayload.email) {
                    // there are some tokens (firebase) having picture and name on the main level.
                    _overwriteLocalParticipant(store, {
                        avatarURL: jwtPayload.picture,
                        name: jwtPayload.name,
                        email: jwtPayload.email
                    });
                }
            }
        }
        else if (typeof APP === 'undefined') {
            // The logic of restoring JWT overrides make sense only on mobile.
            // On Web it should eventually be restored from storage, but there's
            // no such use case yet.
            const { user } = store.getState()['features/base/jwt'];
            user && _undoOverwriteLocalParticipant(store, user);
        }
    }
    return next(action);
}
/**
 * Undoes/resets the values overwritten by {@link _overwriteLocalParticipant}
 * by either clearing them or setting to default values. Only the values that
 * have not changed since the overwrite happened will be restored.
 *
 * NOTE Once it is possible to edit and save participant properties, this
 * function should restore values from the storage instead.
 *
 * @param {Store} store - The redux store.
 * @param {Object} localParticipant - The {@code Participant} structure used
 * previously to {@link _overwriteLocalParticipant}.
 * @private
 * @returns {void}
 */
function _undoOverwriteLocalParticipant({ dispatch, getState }, { avatarURL, name, email }) {
    let localParticipant;
    if ((avatarURL || name || email)
        && (localParticipant = (0, functions_1.getLocalParticipant)(getState))) {
        const newProperties = {
            id: localParticipant.id,
            local: true
        };
        if (avatarURL === localParticipant.avatarURL) {
            newProperties.avatarURL = undefined;
        }
        if (email === localParticipant.email) {
            newProperties.email = undefined;
        }
        if (name === localParticipant.name) {
            newProperties.name = undefined;
        }
        newProperties.features = undefined;
        dispatch((0, actions_1.participantUpdated)(newProperties));
    }
}
/**
 * Converts the JWT {@code context.user} structure to the {@code Participant}
 * structure stored in the redux state base/participants.
 *
 * @param {Object} user - The JWT {@code context.user} structure to convert.
 * @private
 * @returns {{
 *     avatarURL: ?string,
 *     email: ?string,
 *     id: ?string,
 *     name: ?string,
 *     hidden-from-recorder: ?boolean
 * }}
 */
function _user2participant({ avatar, avatarUrl, email, id, name, 'hidden-from-recorder': hiddenFromRecorder }) {
    const participant = {};
    if (typeof avatarUrl === 'string') {
        participant.avatarURL = avatarUrl.trim();
    }
    else if (typeof avatar === 'string') {
        participant.avatarURL = avatar.trim();
    }
    if (typeof email === 'string') {
        participant.email = email.trim();
    }
    if (typeof id === 'string') {
        participant.id = id.trim();
    }
    if (typeof name === 'string') {
        participant.name = name.trim();
    }
    if (hiddenFromRecorder === 'true' || hiddenFromRecorder === true) {
        participant.hiddenFromRecorder = true;
    }
    return Object.keys(participant).length ? participant : undefined;
}
