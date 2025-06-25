"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_DETECTION = exports.NO_FACE_DETECTION_THRESHOLD = exports.FACE_LANDMARKS_DETECTION_ERROR_THRESHOLD = exports.FACE_DETECTION_SCORE_THRESHOLD = exports.DETECTION_TYPES = exports.DETECT_FACE = exports.SEND_IMAGE_INTERVAL_MS = exports.FACE_LANDMARKS_EVENT_TYPE = exports.FACE_BOX_EVENT_TYPE = exports.INIT_WORKER = exports.WEBHOOK_SEND_TIME_INTERVAL = exports.FACE_EXPRESSIONS_NAMING_MAPPING = exports.FACE_EXPRESSIONS = exports.FACE_EXPRESSIONS_EMOJIS = void 0;
exports.FACE_EXPRESSIONS_EMOJIS = {
    happy: '😊',
    neutral: '😐',
    sad: '🙁',
    surprised: '😮',
    angry: '😠',
    fearful: '😨'
    // disgusted: '🤢'
};
exports.FACE_EXPRESSIONS = ['happy', 'neutral', 'sad', 'surprised', 'angry', 'fearful'];
exports.FACE_EXPRESSIONS_NAMING_MAPPING = {
    happy: 'happy',
    neutral: 'neutral',
    surprise: 'surprised',
    angry: 'angry',
    fear: 'fearful',
    disgust: 'disgusted',
    sad: 'sad'
};
/**
 * Time is ms used for sending expression.
 */
exports.WEBHOOK_SEND_TIME_INTERVAL = 15000;
/**
 * Type of message sent from main thread to worker that contains init information:
 * such as models directory and window screen size.
 */
exports.INIT_WORKER = 'INIT_WORKER';
/**
 * Type of event sent on the data channel.
 */
exports.FACE_BOX_EVENT_TYPE = 'face-box';
/**
 * Type of event sent on the data channel.
 */
exports.FACE_LANDMARKS_EVENT_TYPE = 'face-landmarks';
/**
 * Milliseconds interval value for sending new image data to the worker.
 */
exports.SEND_IMAGE_INTERVAL_MS = 1000;
/**
 * Type of message sent from main thread to worker that contain image data and
 * will trigger a response message from the worker containing the detected face(s) info.
 */
exports.DETECT_FACE = 'DETECT_FACE';
/**
 * Available detection types.
 */
exports.DETECTION_TYPES = {
    FACE_BOX: 'face-box',
    FACE_EXPRESSIONS: 'face-expressions'
};
/**
 * Threshold for detection score of face.
 */
exports.FACE_DETECTION_SCORE_THRESHOLD = 0.75;
/**
 * Threshold for stopping detection after a certain number of consecutive errors have occurred.
 */
exports.FACE_LANDMARKS_DETECTION_ERROR_THRESHOLD = 4;
/**
 * Threshold for number of consecutive detections with no face,
 * so that when achieved there will be dispatched an action.
 */
exports.NO_FACE_DETECTION_THRESHOLD = 5;
/**
 * Constant type used for signaling that no valid face detection is found.
 */
exports.NO_DETECTION = 'no-detection';
