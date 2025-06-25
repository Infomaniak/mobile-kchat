import { IJitsiConference } from '../base/conference/reducer';
interface IStats {
    codec?: Object;
    framerate?: Object;
    resolution?: Object;
}
/**
 * A singleton that acts as a pub/sub service for connection stat updates.
 */
declare const statsEmitter: {
    /**
     * Have {@code statsEmitter} subscribe to stat updates from a given
     * conference.
     *
     * @param {JitsiConference} conference - The conference for which
     * {@code statsEmitter} should subscribe for stat updates.
     * @returns {void}
     */
    startListeningForStats(conference: IJitsiConference): void;
    /**
     * Add a subscriber to be notified when stats are updated for a specified
     * user id.
     *
     * @param {string} id - The user id whose stats updates are of interest.
     * @param {Function} callback - The function to invoke when stats for the
     * user have been updated.
     * @returns {void}
     */
    subscribeToClientStats(id: string | undefined, callback: Function): void;
    /**
     * Remove a subscriber that is listening for stats updates for a specified
     * user id.
     *
     * @param {string} id - The user id whose stats updates are no longer of
     * interest.
     * @param {Function} callback - The function that is currently subscribed to
     * stat updates for the specified user id.
     * @returns {void}
     */
    unsubscribeToClientStats(id: string, callback: Function): void;
    /**
     * Emit a stat update to all those listening for a specific user's
     * connection stats.
     *
     * @param {string} id - The user id the stats are associated with.
     * @param {Object} stats - New connection stats for the user.
     * @returns {void}
     */
    _emitStatsUpdate(id: string, stats?: IStats): void;
    /**
     * Emit a stat update to all those listening for local stat updates. Will
     * also update listeners of remote user stats of changes related to their
     * stats.
     *
     * @param {string} localUserId - The user id for the local user.
     * @param {Object} stats - Connection stats for the local user as provided
     * by the library.
     * @returns {void}
     */
    _onStatsUpdated(localUserId: string, stats: IStats): void;
};
export default statsEmitter;
