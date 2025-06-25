"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVATAR_SIZE = exports.VideoStateIcons = exports.AudioStateIcons = exports.QUICK_ACTION_BUTTON = exports.MEDIA_STATE = exports.ACTION_TRIGGER = exports.REDUCER_KEY = void 0;
const react_1 = __importDefault(require("react"));
const Icon_1 = __importDefault(require("../base/icons/components/Icon"));
const svg_1 = require("../base/icons/svg");
/**
 * Reducer key for the feature.
 */
exports.REDUCER_KEY = 'features/participants-pane';
/**
 * Enum of possible participant action triggers.
 */
exports.ACTION_TRIGGER = {
    HOVER: 'Hover',
    PERMANENT: 'Permanent'
};
/**
 * Enum of possible participant media states.
 */
exports.MEDIA_STATE = {
    DOMINANT_SPEAKER: 'DominantSpeaker',
    MUTED: 'Muted',
    FORCE_MUTED: 'ForceMuted',
    UNMUTED: 'Unmuted',
    NONE: 'None'
};
/**
 * Enum of possible participant mute button states.
 */
exports.QUICK_ACTION_BUTTON = {
    ALLOW_VIDEO: 'AllowVideo',
    MUTE: 'Mute',
    ASK_TO_UNMUTE: 'AskToUnmute',
    NONE: 'None',
    STOP_VIDEO: 'StopVideo'
};
/**
 * Icon mapping for possible participant audio states.
 */
exports.AudioStateIcons = {
    [exports.MEDIA_STATE.DOMINANT_SPEAKER]: (react_1.default.createElement(Icon_1.default, { className: 'jitsi-icon-dominant-speaker', size: 16, src: svg_1.IconMic })),
    [exports.MEDIA_STATE.FORCE_MUTED]: (react_1.default.createElement(Icon_1.default, { color: '#E04757', size: 16, src: svg_1.IconMicSlash })),
    [exports.MEDIA_STATE.MUTED]: (react_1.default.createElement(Icon_1.default, { size: 16, src: svg_1.IconMicSlash })),
    [exports.MEDIA_STATE.UNMUTED]: (react_1.default.createElement(Icon_1.default, { size: 16, src: svg_1.IconMic })),
    [exports.MEDIA_STATE.NONE]: null
};
/**
 * Icon mapping for possible participant video states.
 */
exports.VideoStateIcons = {
    [exports.MEDIA_STATE.DOMINANT_SPEAKER]: null,
    [exports.MEDIA_STATE.FORCE_MUTED]: (react_1.default.createElement(Icon_1.default, { color: '#E04757', id: 'videoMuted', size: 16, src: svg_1.IconVideoOff })),
    [exports.MEDIA_STATE.MUTED]: (react_1.default.createElement(Icon_1.default, { id: 'videoMuted', size: 16, src: svg_1.IconVideoOff })),
    [exports.MEDIA_STATE.UNMUTED]: (react_1.default.createElement(Icon_1.default, { size: 16, src: svg_1.IconVideo })),
    [exports.MEDIA_STATE.NONE]: null
};
/**
 * Mobile web context menu avatar size.
 */
exports.AVATAR_SIZE = 20;
