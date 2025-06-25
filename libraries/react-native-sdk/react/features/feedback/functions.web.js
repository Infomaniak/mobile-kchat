"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldSendJaaSFeedbackMetadata = exports.sendFeedbackToJaaSRequest = void 0;
const functions_1 = require("../jaas/functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Sends feedback metadata to JaaS endpoints.
 *
 * @param {string|undefined} url - The JaaS metadata endpoint URL.
 * @param {Object} feedbackData - The feedback data object.
 * @returns {Promise}
 */
async function sendFeedbackToJaaSRequest(url, feedbackData) {
    if (!url) {
        throw new TypeError('Trying to send jaas feedback request to an undefined URL!');
    }
    const { jwt, sessionId, meetingFqn, score, message, userId, tenant } = feedbackData;
    const headers = {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
    };
    const data = {
        sessionId,
        meetingFqn,
        userId,
        tenant,
        submitted: new Date().getTime(),
        rating: score,
        comments: message
    };
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            logger_1.default.error('Status error:', res.status);
        }
    }
    catch (err) {
        logger_1.default.error('Could not send request', err);
    }
}
exports.sendFeedbackToJaaSRequest = sendFeedbackToJaaSRequest;
/**
 * Returns whether jaas feedback metadata should be send or not.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if jaas feedback metadata should be send and false otherwise.
 */
function shouldSendJaaSFeedbackMetadata(state) {
    const { jaasFeedbackMetadataURL } = state['features/base/config'];
    return Boolean((0, functions_1.isVpaasMeeting)(state) && jaasFeedbackMetadataURL);
}
exports.shouldSendJaaSFeedbackMetadata = shouldSendJaaSFeedbackMetadata;
