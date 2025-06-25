"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const AudioLevelIndicator_1 = __importDefault(require("../../../audio-level-indicator/components/AudioLevelIndicator"));
const _1 = __importDefault(require("../../../base/lib-jitsi-meet/_"));
const JitsiTrackEvents = _1.default.events.track;
const ThumbnailAudioIndicator = ({ _audioTrack }) => {
    const [audioLevel, setAudioLevel] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        setAudioLevel(0);
        if (_audioTrack) {
            const { jitsiTrack } = _audioTrack;
            jitsiTrack?.on(JitsiTrackEvents.TRACK_AUDIO_LEVEL_CHANGED, setAudioLevel);
        }
        return () => {
            if (_audioTrack) {
                const { jitsiTrack } = _audioTrack;
                jitsiTrack?.off(JitsiTrackEvents.TRACK_AUDIO_LEVEL_CHANGED, setAudioLevel);
            }
        };
    }, [_audioTrack]);
    return (react_1.default.createElement("span", { className: 'audioindicator-container' },
        react_1.default.createElement(AudioLevelIndicator_1.default, { audioLevel: audioLevel })));
};
exports.default = ThumbnailAudioIndicator;
