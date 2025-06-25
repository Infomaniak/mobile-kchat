"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetectionInterval = exports.getVideoObjectPosition = exports.sendFaceExpressionsWebhook = exports.sendFaceExpressionToServer = exports.sendFaceBoxToParticipants = exports.sendFaceExpressionToParticipants = void 0;
const functions_1 = require("../base/participants/functions");
const functions_any_1 = require("../dynamic-branding/functions.any");
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
/**
 * Sends the face landmarks to other participants via the data channel.
 *
 * @param {any} conference - The current conference.
 * @param  {FaceLandmarks} faceLandmarks - Face landmarks to be sent.
 * @returns {void}
 */
function sendFaceExpressionToParticipants(conference, faceLandmarks) {
    try {
        conference.sendEndpointMessage('', {
            type: constants_1.FACE_LANDMARKS_EVENT_TYPE,
            faceLandmarks
        });
    }
    catch (err) {
        logger_1.default.warn('Could not broadcast the face landmarks to the other participants', err);
    }
}
exports.sendFaceExpressionToParticipants = sendFaceExpressionToParticipants;
/**
 * Sends the face box to all the other participants.
 *
 * @param {any} conference - The current conference.
 * @param  {FaceBox} faceBox - Face box to be sent.
 * @returns {void}
 */
function sendFaceBoxToParticipants(conference, faceBox) {
    try {
        conference.sendEndpointMessage('', {
            type: constants_1.FACE_BOX_EVENT_TYPE,
            faceBox
        });
    }
    catch (err) {
        logger_1.default.warn('Could not broadcast the face box to the other participants', err);
    }
}
exports.sendFaceBoxToParticipants = sendFaceBoxToParticipants;
/**
 * Sends the face landmarks to prosody.
 *
 * @param {any} conference - The current conference.
 * @param  {FaceLandmarks} faceLandmarks - Face landmarks to be sent.
 * @returns {void}
 */
function sendFaceExpressionToServer(conference, faceLandmarks) {
    try {
        conference?.sendFaceLandmarks(faceLandmarks);
    }
    catch (err) {
        logger_1.default.warn('Could not send the face landmarks to prosody', err);
    }
}
exports.sendFaceExpressionToServer = sendFaceExpressionToServer;
/**
 * Sends face landmarks to backend.
 *
 * @param  {Object} state - Redux state.
 * @returns {boolean} - True if sent, false otherwise.
 */
async function sendFaceExpressionsWebhook(state) {
    const { webhookProxyUrl: url } = state['features/base/config'];
    const { conference } = state['features/base/conference'];
    const { jwt } = state['features/base/jwt'];
    const { connection } = state['features/base/connection'];
    const jid = connection?.getJid();
    const localParticipant = (0, functions_1.getLocalParticipant)(state);
    const { faceLandmarksBuffer } = state['features/face-landmarks'];
    if (faceLandmarksBuffer.length === 0) {
        return false;
    }
    const headers = {
        ...jwt ? { 'Authorization': `Bearer ${jwt}` } : {},
        'Content-Type': 'application/json'
    };
    const reqBody = {
        meetingFqn: (0, functions_any_1.extractFqnFromPath)(),
        sessionId: conference?.getMeetingUniqueId(),
        submitted: Date.now(),
        emotions: faceLandmarksBuffer,
        participantId: localParticipant?.jwtId,
        participantName: localParticipant?.name,
        participantJid: jid
    };
    if (url) {
        try {
            const res = await fetch(`${url}/emotions`, {
                method: 'POST',
                headers,
                body: JSON.stringify(reqBody)
            });
            if (res.ok) {
                return true;
            }
            logger_1.default.error('Status error:', res.status);
        }
        catch (err) {
            logger_1.default.error('Could not send request', err);
        }
    }
    return false;
}
exports.sendFaceExpressionsWebhook = sendFaceExpressionsWebhook;
/**
 * Gets face box for a participant id.
 *
 * @param {string} id - The participant id.
 * @param {IReduxState} state - The redux state.
 * @returns {Object}
 */
function getFaceBoxForId(id, state) {
    return state['features/face-landmarks'].faceBoxes[id];
}
/**
 * Gets the video object position for a participant id.
 *
 * @param {IReduxState} state - The redux state.
 * @param {string} id - The participant id.
 * @returns {string} - CSS object-position in the shape of '{horizontalPercentage}% {verticalPercentage}%'.
 */
function getVideoObjectPosition(state, id) {
    const faceBox = id && getFaceBoxForId(id, state);
    if (faceBox) {
        const { right, width } = faceBox;
        if (right && width) {
            return `${right - (width / 2)}% 50%`;
        }
    }
    return '50% 50%';
}
exports.getVideoObjectPosition = getVideoObjectPosition;
/**
 * Gets the video object position for a participant id.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {number} - Number of milliseconds for doing face detection.
 */
function getDetectionInterval(state) {
    const { faceLandmarks } = state['features/base/config'];
    return Math.max(faceLandmarks?.captureInterval || constants_1.SEND_IMAGE_INTERVAL_MS);
}
exports.getDetectionInterval = getDetectionInterval;
