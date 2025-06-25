"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newFaceBox = exports.clearFaceExpressionBuffer = exports.addFaceLandmarks = void 0;
require("image-capture");
require("./createImageBitmap");
const actionTypes_1 = require("./actionTypes");
/**
 * Adds new face landmarks to the timeline.
 *
 * @param {FaceLandmarks} faceLandmarks - The new face landmarks to timeline.
 * @param {boolean} addToBuffer - If true adds the face landmarks to a buffer in the reducer for webhook.
 * @returns {AnyAction}
 */
function addFaceLandmarks(faceLandmarks, addToBuffer) {
    return {
        type: actionTypes_1.ADD_FACE_LANDMARKS,
        faceLandmarks,
        addToBuffer
    };
}
exports.addFaceLandmarks = addFaceLandmarks;
/**
 * Clears the face landmarks array in the state.
 *
 * @returns {AnyAction}
 */
function clearFaceExpressionBuffer() {
    return {
        type: actionTypes_1.CLEAR_FACE_LANDMARKS_BUFFER
    };
}
exports.clearFaceExpressionBuffer = clearFaceExpressionBuffer;
/**
 * Signals that a new face box was obtained for the local participant.
 *
 * @param {FaceBox} faceBox - The face box of the local participant.
 * @returns {AnyAction}
 */
function newFaceBox(faceBox) {
    return {
        type: actionTypes_1.NEW_FACE_COORDINATES,
        faceBox
    };
}
exports.newFaceBox = newFaceBox;
