import { DominantSpeakerData, E2ERTTData, FaceLandmarksData, VideoTypeData } from './types';
/**
 * Handle lib-jitsi-meet rtcstats events and send jitsi-meet specific statistics.
 */
declare class RTCStats {
    private _connStateEvents;
    private _initialized;
    /**
     * Handles rtcstats events.
     *
     * @returns {void}
     */
    init(): void;
    /**
     * Send console logs to rtcstats server.
     *
     * @param {Array<string|any>} logEntries - The log entries to send to the rtcstats server.
     * @returns {void}
     */
    sendLogs(logEntries: Array<string | any>): void;
    /**
     * Send dominant speaker data, the data will be processed by rtcstats-server and saved in the dump file.
     *
     * @param {Object} dominantSpeakerData - Dominant speaker data to be saved in the rtcstats dump.
     * @returns {void}
     */
    sendDominantSpeakerData(dominantSpeakerData: DominantSpeakerData): void;
    /**
     * Send e2e rtt data, the data will be processed by rtcstats-server and saved in the dump file.
     *
     * @param {Object} e2eRttData - The object that holds the e2e data.
     * @returns {void}
     */
    sendE2ERTTData(e2eRttData: E2ERTTData): void;
    /**
     * Send identity data, the data will be processed by rtcstats-server and saved in the dump file.
     *
     * @param {Object} identityData - The object that holds the identity data.
     * @returns {void}
     */
    sendIdentityData(identityData: Object): void;
    /**
     * Send the timestamp of the start of the conference, the data will be processed by the rtcstats-server
     * and saved in the dump file.
     *
     * @param {Object} timestamp - The object which contains the timestamp.
     * @returns {void}
     */
    sendConferenceTimestamp(timestamp: number): void;
    /**
     * Send videoType data, the data will be processed by rtcstats-server and saved in the dump file.
     *
     * @param {Object} videoTypeData - The object that holds the videoType data.
     * @returns {void}
     */
    sendVideoTypeData(videoTypeData: VideoTypeData): void;
    /**
     * Send face landmarks data, the data will be processed by rtcstats-server and saved in the dump file.
     *
     * @param {Object} faceLandmarksData - Face landmarks data to be saved in the rtcstats dump.
     * @returns {void}
     */
    sendFaceLandmarksData(faceLandmarksData: FaceLandmarksData): void;
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
    handleRTCStatsEvent(event: any): void;
}
declare const _default: RTCStats;
export default _default;
