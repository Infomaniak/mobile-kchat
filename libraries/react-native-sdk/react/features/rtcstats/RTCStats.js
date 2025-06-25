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
/* eslint-disable lines-around-comment */
const events_1 = require("@jitsi/rtcstats/events");
const lib_jitsi_meet_1 = __importStar(require("../base/lib-jitsi-meet"));
const logger_1 = __importDefault(require("./logger"));
/**
 * Handle lib-jitsi-meet rtcstats events and send jitsi-meet specific statistics.
 */
class RTCStats {
    constructor() {
        this._connStateEvents = [];
        this._initialized = false;
    }
    /**
     * Handles rtcstats events.
     *
     * @returns {void}
     */
    init() {
        this._connStateEvents = [];
        if (!this._initialized) {
            lib_jitsi_meet_1.default.rtcstats.on(lib_jitsi_meet_1.RTCStatsEvents.RTC_STATS_PC_EVENT, (pcEvent) => this.handleRTCStatsEvent(pcEvent));
            this._initialized = true;
        }
    }
    /**
     * Send console logs to rtcstats server.
     *
     * @param {Array<string|any>} logEntries - The log entries to send to the rtcstats server.
     * @returns {void}
     */
    sendLogs(logEntries) {
        lib_jitsi_meet_1.default.rtcstats.sendStatsEntry('logs', logEntries);
    }
    /**
     * Send dominant speaker data, the data will be processed by rtcstats-server and saved in the dump file.
     *
     * @param {Object} dominantSpeakerData - Dominant speaker data to be saved in the rtcstats dump.
     * @returns {void}
     */
    sendDominantSpeakerData(dominantSpeakerData) {
        lib_jitsi_meet_1.default.rtcstats.sendStatsEntry('dominantSpeaker', dominantSpeakerData);
    }
    /**
     * Send e2e rtt data, the data will be processed by rtcstats-server and saved in the dump file.
     *
     * @param {Object} e2eRttData - The object that holds the e2e data.
     * @returns {void}
     */
    sendE2ERTTData(e2eRttData) {
        lib_jitsi_meet_1.default.rtcstats.sendStatsEntry('e2eRtt', e2eRttData);
    }
    /**
     * Send identity data, the data will be processed by rtcstats-server and saved in the dump file.
     *
     * @param {Object} identityData - The object that holds the identity data.
     * @returns {void}
     */
    sendIdentityData(identityData) {
        lib_jitsi_meet_1.default.rtcstats.sendIdentityEntry(identityData);
    }
    /**
     * Send the timestamp of the start of the conference, the data will be processed by the rtcstats-server
     * and saved in the dump file.
     *
     * @param {Object} timestamp - The object which contains the timestamp.
     * @returns {void}
     */
    sendConferenceTimestamp(timestamp) {
        lib_jitsi_meet_1.default.rtcstats.sendStatsEntry('conferenceStartTimestamp', timestamp);
    }
    /**
     * Send videoType data, the data will be processed by rtcstats-server and saved in the dump file.
     *
     * @param {Object} videoTypeData - The object that holds the videoType data.
     * @returns {void}
     */
    sendVideoTypeData(videoTypeData) {
        lib_jitsi_meet_1.default.rtcstats.sendStatsEntry('setVideoType', videoTypeData);
    }
    /**
     * Send face landmarks data, the data will be processed by rtcstats-server and saved in the dump file.
     *
     * @param {Object} faceLandmarksData - Face landmarks data to be saved in the rtcstats dump.
     * @returns {void}
     */
    sendFaceLandmarksData(faceLandmarksData) {
        lib_jitsi_meet_1.default.rtcstats.sendStatsEntry('faceLandmarks', faceLandmarksData);
    }
    /**
     * RTCStats client can notify the APP of any PeerConnection related event that occurs.
     *
     * @param {Object} event - The PeerConnection event.
     * @param {string} event.type - The event type.
     * @param {Object} event.body - Event body.
     * @param {string} event.body.isP2P - PeerConnection type.
     * @param {string} event.body.state - PeerConnection state change which triggered the event.
     * @returns {void}
     */
    handleRTCStatsEvent(event) {
        switch (event.type) {
            case events_1.PC_CON_STATE_CHANGE: {
                const { body: { isP2P = null, state = null } } = event;
                this._connStateEvents.push(event.body);
                // We only report PC related connection issues. If the rtcstats websocket is not connected at this point
                // it usually means that none of our services can be reached i.e. there's problem with the internet
                // connection and not necessarily with reaching the JVB (due to a firewall or other reasons).
                if (state === events_1.PC_STATE_FAILED) {
                    const connectionType = isP2P ? 'P2P' : 'JVB';
                    const wasConnected = this._connStateEvents.some((connectionEvent) => (connectionEvent.isP2P === isP2P) && (connectionEvent.state === events_1.PC_STATE_CONNECTED));
                    logger_1.default.info(`${connectionType} PeerConnection failed, previously connected: ${wasConnected}`);
                    if (typeof APP !== 'undefined') {
                        APP.API.notifyPeerConnectionFailure(isP2P, wasConnected);
                    }
                }
                break;
            }
        }
    }
}
exports.default = new RTCStats();
