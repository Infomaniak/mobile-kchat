export declare const FACE_EXPRESSIONS_EMOJIS: {
    happy: string;
    neutral: string;
    sad: string;
    surprised: string;
    angry: string;
    fearful: string;
};
export declare const FACE_EXPRESSIONS: string[];
export declare const FACE_EXPRESSIONS_NAMING_MAPPING: {
    happy: string;
    neutral: string;
    surprise: string;
    angry: string;
    fear: string;
    disgust: string;
    sad: string;
};
/**
 * Time is ms used for sending expression.
 */
export declare const WEBHOOK_SEND_TIME_INTERVAL = 15000;
/**
 * Type of message sent from main thread to worker that contains init information:
 * such as models directory and window screen size.
 */
export declare const INIT_WORKER = "INIT_WORKER";
/**
 * Type of event sent on the data channel.
 */
export declare const FACE_BOX_EVENT_TYPE = "face-box";
/**
 * Type of event sent on the data channel.
 */
export declare const FACE_LANDMARKS_EVENT_TYPE = "face-landmarks";
/**
 * Milliseconds interval value for sending new image data to the worker.
 */
export declare const SEND_IMAGE_INTERVAL_MS = 1000;
/**
 * Type of message sent from main thread to worker that contain image data and
 * will trigger a response message from the worker containing the detected face(s) info.
 */
export declare const DETECT_FACE = "DETECT_FACE";
/**
 * Available detection types.
 */
export declare const DETECTION_TYPES: {
    FACE_BOX: string;
    FACE_EXPRESSIONS: string;
};
/**
 * Threshold for detection score of face.
 */
export declare const FACE_DETECTION_SCORE_THRESHOLD = 0.75;
/**
 * Threshold for stopping detection after a certain number of consecutive errors have occurred.
 */
export declare const FACE_LANDMARKS_DETECTION_ERROR_THRESHOLD = 4;
/**
 * Threshold for number of consecutive detections with no face,
 * so that when achieved there will be dispatched an action.
 */
export declare const NO_FACE_DETECTION_THRESHOLD = 5;
/**
 * Constant type used for signaling that no valid face detection is found.
 */
export declare const NO_DETECTION = "no-detection";
