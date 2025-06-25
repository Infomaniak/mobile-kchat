import { IStore } from '../../app/types';
/**
 * Implements log storage interface from the @jitsi/logger lib.
 */
export default class JitsiMeetLogStorage {
    counter: number;
    getState: IStore['getState'];
    /**
     * Creates new <tt>JitsiMeetLogStorage</tt>.
     *
     * @param {Function} getState - The Redux store's {@code getState} method.
     */
    constructor(getState: IStore['getState']);
    /**
     * The JitsiMeetLogStorage is ready when the conference has been joined.
     * A conference is considered joined when the 'conference' field is defined
     * in the base/conference state.
     *
     * @returns {boolean} <tt>true</tt> when this storage is ready or
     * <tt>false</tt> otherwise.
     */
    isReady(): boolean;
    /**
     * Checks whether rtcstats logs storage is enabled.
     *
     * @returns {boolean} <tt>true</tt> when this storage can store logs to
     * rtcstats, <tt>false</tt> otherwise.
     */
    canStoreLogsRtcstats(): boolean | undefined;
    /**
     * Called by the <tt>LogCollector</tt> to store a series of log lines into
     * batch.
     *
     * @param {Array<string|Object>} logEntries - An array containing strings
     * representing log lines or aggregated lines objects.
     * @returns {void}
     */
    storeLogs(logEntries: Array<string | any>): void;
}
