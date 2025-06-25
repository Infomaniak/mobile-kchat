"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldDisplayReactionsButtons = exports.isReactionsEnabled = exports.getReactionsSoundsThresholds = exports.sendReactionsWebhook = exports.getReactionsWithId = exports.getReactionMessageFromBuffer = exports.getReactionsQueue = void 0;
const uuid_1 = require("uuid");
const constants_1 = require("../base/flags/constants");
const functions_1 = require("../base/flags/functions");
const functions_2 = require("../base/participants/functions");
const functions_any_1 = require("../dynamic-branding/functions.any");
const functions_3 = require("../visitors/functions");
const constants_2 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
/**
 * Returns the queue of reactions.
 *
 * @param {Object} state - The state of the application.
 * @returns {Array}
 */
function getReactionsQueue(state) {
    return state['features/reactions'].queue;
}
exports.getReactionsQueue = getReactionsQueue;
/**
 * Returns chat message from reactions buffer.
 *
 * @param {Array} buffer - The reactions buffer.
 * @returns {string}
 */
function getReactionMessageFromBuffer(buffer) {
    return buffer.map(reaction => constants_2.REACTIONS[reaction].message).reduce((acc, val) => `${acc}${val}`);
}
exports.getReactionMessageFromBuffer = getReactionMessageFromBuffer;
/**
 * Returns reactions array with uid.
 *
 * @param {Array} buffer - The reactions buffer.
 * @returns {Array}
 */
function getReactionsWithId(buffer) {
    return buffer.map(reaction => {
        return {
            reaction,
            uid: (0, uuid_1.v4)()
        };
    });
}
exports.getReactionsWithId = getReactionsWithId;
/**
 * Sends reactions to the backend.
 *
 * @param {Object} state - The redux state object.
 * @param {Array} reactions - Reactions array to be sent.
 * @returns {void}
 */
async function sendReactionsWebhook(state, reactions) {
    const { webhookProxyUrl: url } = state['features/base/config'];
    const { conference } = state['features/base/conference'];
    const { jwt } = state['features/base/jwt'];
    const { connection } = state['features/base/connection'];
    const jid = connection?.getJid();
    const localParticipant = (0, functions_2.getLocalParticipant)(state);
    const headers = {
        ...jwt ? { 'Authorization': `Bearer ${jwt}` } : {},
        'Content-Type': 'application/json'
    };
    const reqBody = {
        meetingFqn: (0, functions_any_1.extractFqnFromPath)(),
        sessionId: conference?.sessionId,
        submitted: Date.now(),
        reactions,
        participantId: localParticipant?.jwtId,
        participantName: localParticipant?.name,
        participantJid: jid
    };
    if (url) {
        try {
            const res = await fetch(`${url}/reactions`, {
                method: 'POST',
                headers,
                body: JSON.stringify(reqBody)
            });
            if (!res.ok) {
                logger_1.default.error('Status error:', res.status);
            }
        }
        catch (err) {
            logger_1.default.error('Could not send request', err);
        }
    }
}
exports.sendReactionsWebhook = sendReactionsWebhook;
/**
 * Returns unique reactions from the reactions buffer.
 *
 * @param {Array} reactions - The reactions buffer.
 * @returns {Array}
 */
function getUniqueReactions(reactions) {
    return [...new Set(reactions)];
}
/**
 * Returns frequency of given reaction in array.
 *
 * @param {Array} reactions - Array of reactions.
 * @param {string} reaction - Reaction to get frequency for.
 * @returns {number}
 */
function getReactionFrequency(reactions, reaction) {
    return reactions.filter(r => r === reaction).length;
}
/**
 * Returns the threshold number for a given frequency.
 *
 * @param {number} frequency - Frequency of reaction.
 * @returns {number}
 */
function getSoundThresholdByFrequency(frequency) {
    for (const i of constants_2.SOUNDS_THRESHOLDS) {
        if (frequency <= i) {
            return i;
        }
    }
    return constants_2.SOUNDS_THRESHOLDS[constants_2.SOUNDS_THRESHOLDS.length - 1];
}
/**
 * Returns unique reactions with threshold.
 *
 * @param {Array} reactions - The reactions buffer.
 * @returns {Array}
 */
function getReactionsSoundsThresholds(reactions) {
    const unique = getUniqueReactions(reactions);
    return unique.map(reaction => {
        return {
            reaction,
            threshold: getSoundThresholdByFrequency(getReactionFrequency(reactions, reaction))
        };
    });
}
exports.getReactionsSoundsThresholds = getReactionsSoundsThresholds;
/**
 * Whether or not the reactions are enabled.
 *
 * @param {Object} state - The Redux state object.
 * @returns {boolean}
 */
function isReactionsEnabled(state) {
    const { disableReactions } = state['features/base/config'];
    if (navigator.product === 'ReactNative') {
        return !disableReactions && (0, functions_1.getFeatureFlag)(state, constants_1.REACTIONS_ENABLED, true);
    }
    return !disableReactions;
}
exports.isReactionsEnabled = isReactionsEnabled;
/**
 * Returns true if the reactions buttons should be displayed anywhere on the page and false otherwise.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean}
 */
function shouldDisplayReactionsButtons(state) {
    return isReactionsEnabled(state) && !(0, functions_3.iAmVisitor)(state);
}
exports.shouldDisplayReactionsButtons = shouldDisplayReactionsButtons;
