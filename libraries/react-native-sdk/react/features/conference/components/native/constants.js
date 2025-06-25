"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPANDED_LABELS = exports.LABEL_ID_VISITORS_COUNT = exports.LABEL_ID_RAISED_HANDS_COUNT = exports.LABEL_ID_INSECURE_ROOM_NAME = exports.LABEL_ID_STREAMING = exports.LABEL_ID_RECORDING = exports.LABEL_ID_QUALITY = exports.EXPANDED_LABEL_TIMEOUT = exports.LabelHitSlop = void 0;
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const RecordingExpandedLabel_1 = __importDefault(require("../../../recording/components/native/RecordingExpandedLabel"));
const VideoQualityExpandedLabel_native_1 = __importDefault(require("../../../video-quality/components/VideoQualityExpandedLabel.native"));
const InsecureRoomNameExpandedLabel_1 = __importDefault(require("./InsecureRoomNameExpandedLabel"));
const RaisedHandsCountExpandedLabel_1 = __importDefault(require("./RaisedHandsCountExpandedLabel"));
exports.LabelHitSlop = {
    top: 10,
    bottom: 10,
    left: 0,
    right: 0
};
/**
 * Timeout to hide the {@ExpandedLabel}.
 */
exports.EXPANDED_LABEL_TIMEOUT = 5000;
exports.LABEL_ID_QUALITY = 'quality';
exports.LABEL_ID_RECORDING = 'recording';
exports.LABEL_ID_STREAMING = 'streaming';
exports.LABEL_ID_INSECURE_ROOM_NAME = 'insecure-room-name';
exports.LABEL_ID_RAISED_HANDS_COUNT = 'raised-hands-count';
exports.LABEL_ID_VISITORS_COUNT = 'visitors-count';
/**
 * The {@code ExpandedLabel} components to be rendered for the individual
 * {@code Label}s.
 */
exports.EXPANDED_LABELS = {
    [exports.LABEL_ID_QUALITY]: {
        component: VideoQualityExpandedLabel_native_1.default
    },
    [exports.LABEL_ID_RECORDING]: {
        component: RecordingExpandedLabel_1.default,
        props: {
            mode: lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE
        },
        alwaysOn: true
    },
    [exports.LABEL_ID_STREAMING]: {
        component: RecordingExpandedLabel_1.default,
        props: {
            mode: lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM
        },
        alwaysOn: true
    },
    [exports.LABEL_ID_INSECURE_ROOM_NAME]: {
        component: InsecureRoomNameExpandedLabel_1.default
    },
    [exports.LABEL_ID_RAISED_HANDS_COUNT]: {
        component: RaisedHandsCountExpandedLabel_1.default,
        alwaysOn: true
    }
};
