"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RTCStatsEvents = exports.JitsiTrackEvents = exports.JitsiTrackErrors = exports.JitsiSIPVideoGWStatus = exports.JitsiRecordingConstants = exports.JitsiTrackStreamingStatus = exports.JitsiMediaDevicesEvents = exports.JitsiE2ePingEvents = exports.JitsiDetectionEvents = exports.JitsiConnectionQualityEvents = exports.JitsiConnectionEvents = exports.JitsiConnectionErrors = exports.JitsiConferenceEvents = exports.JitsiConferenceErrors = exports.browser = exports.analytics = exports.default = void 0;
// Re-export JitsiMeetJS from the library lib-jitsi-meet to (the other features
// of) the project jitsi-meet.
const _1 = __importDefault(require("./_"));
exports.default = _1.default;
// XXX Re-export the properties exported by JitsiMeetJS in order to prevent
// undefined imported JitsiMeetJS. It may be caused by import cycles but I have
// not confirmed the theory.
exports.analytics = _1.default.analytics;
exports.browser = _1.default.util.browser;
exports.JitsiConferenceErrors = _1.default.errors.conference;
exports.JitsiConferenceEvents = _1.default.events.conference;
exports.JitsiConnectionErrors = _1.default.errors.connection;
exports.JitsiConnectionEvents = _1.default.events.connection;
exports.JitsiConnectionQualityEvents = _1.default.events.connectionQuality;
exports.JitsiDetectionEvents = _1.default.events.detection;
exports.JitsiE2ePingEvents = _1.default.events.e2eping;
exports.JitsiMediaDevicesEvents = _1.default.events.mediaDevices;
exports.JitsiTrackStreamingStatus = _1.default.constants.trackStreamingStatus;
exports.JitsiRecordingConstants = _1.default.constants.recording;
exports.JitsiSIPVideoGWStatus = _1.default.constants.sipVideoGW;
exports.JitsiTrackErrors = _1.default.errors.track;
exports.JitsiTrackEvents = _1.default.events.track;
exports.RTCStatsEvents = _1.default.events.rtcstats;
