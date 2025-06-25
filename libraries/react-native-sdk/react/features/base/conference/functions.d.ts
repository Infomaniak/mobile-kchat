import { IReduxState, IStore } from '../../app/types';
import { IStateful } from '../app/types';
import { IJitsiConference } from './reducer';
/**
 * Returns root conference state.
 *
 * @param {IReduxState} state - Global state.
 * @returns {Object} Conference state.
 */
export declare const getConferenceState: (state: IReduxState) => import("./reducer").IConferenceState;
/**
 * Is the conference joined or not.
 *
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
export declare const getIsConferenceJoined: (state: IReduxState) => boolean;
/**
 * Attach a set of local tracks to a conference.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @param {JitsiLocalTrack[]} localTracks - List of local media tracks.
 * @protected
 * @returns {Promise}
 */
export declare function _addLocalTracksToConference(conference: IJitsiConference, localTracks: Array<Object>): Promise<any[]>;
/**
 * Logic shared between web and RN which processes the {@code USER_JOINED}
 * conference event and dispatches either {@link participantJoined} or
 * {@link hiddenParticipantJoined}.
 *
 * @param {Object} store - The redux store.
 * @param {JitsiMeetConference} conference - The conference for which the
 * {@code USER_JOINED} event is being processed.
 * @param {JitsiParticipant} user - The user who has just joined.
 * @returns {void}
 */
export declare function commonUserJoinedHandling({ dispatch }: {
    dispatch: IStore['dispatch'];
}, conference: IJitsiConference, user: any): void;
/**
 * Logic shared between web and RN which processes the {@code USER_LEFT}
 * conference event and dispatches either {@link participantLeft} or
 * {@link hiddenParticipantLeft}.
 *
 * @param {Object} store - The redux store.
 * @param {JitsiMeetConference} conference - The conference for which the
 * {@code USER_LEFT} event is being processed.
 * @param {JitsiParticipant} user - The user who has just left.
 * @returns {void}
 */
export declare function commonUserLeftHandling({ dispatch }: {
    dispatch: IStore['dispatch'];
}, conference: IJitsiConference, user: any): void;
/**
 * Evaluates a specific predicate for each {@link JitsiConference} known to the
 * redux state features/base/conference while it returns {@code true}.
 *
 * @param {IStateful} stateful - The redux store, state, or
 * {@code getState} function.
 * @param {Function} predicate - The predicate to evaluate for each
 * {@code JitsiConference} know to the redux state features/base/conference
 * while it returns {@code true}.
 * @returns {boolean} If the specified {@code predicate} returned {@code true}
 * for all {@code JitsiConference} instances known to the redux state
 * features/base/conference.
 */
export declare function forEachConference(stateful: IStateful, predicate: (a: any, b: URL) => boolean): boolean;
/**
 * Returns the display name of the conference.
 *
 * @param {IStateful} stateful - Reference that can be resolved to Redux
 * state with the {@code toState} function.
 * @returns {string}
 */
export declare function getConferenceName(stateful: IStateful): string;
/**
 * Returns the name of the conference formatted for the title.
 *
 * @param {IStateful} stateful - Reference that can be resolved to Redux state with the {@code toState}
 * function.
 * @returns {string} - The name of the conference formatted for the title.
 */
export declare function getConferenceNameForTitle(stateful: IStateful): string;
/**
 * Returns an object aggregating the conference options.
 *
 * @param {IStateful} stateful - The redux store state.
 * @returns {Object} - Options object.
 */
export declare function getConferenceOptions(stateful: IStateful): any;
/**
 * Returns the restored conference options if anything is available to be restored or undefined.
 *
 * @param {IStateful} stateful - The redux store state.
 * @returns {Object?}
 */
export declare function restoreConferenceOptions(stateful: IStateful): {
    hosts: {
        domain: string;
        muc: string;
    };
    focusUserJid: string | undefined;
    disableFocus: boolean;
    bosh: string | undefined;
    websocket: string | undefined;
    oldConfig: undefined;
} | undefined;
/**
 * Override the global config (that is, window.config) with XMPP configuration required to join as a visitor.
 *
 * @param {IStateful} stateful - The redux store state.
 * @param {string|undefined} vnode - The received parameters.
 * @param {string} focusJid - The received parameters.
 * @param {string|undefined} username - The received parameters.
 * @returns {Object}
 */
export declare function getVisitorOptions(stateful: IStateful, vnode: string, focusJid: string, username: string): {
    hosts: {
        domain: string;
        muc: string;
    };
    focusUserJid: string;
    disableLocalStats: boolean;
    bosh: string | undefined;
    p2p: object | undefined;
    websocket: string | undefined;
    oldConfig: undefined;
    disableFocus?: undefined;
} | {
    oldConfig: {
        hosts: {
            domain: string;
        };
        focusUserJid: string | undefined;
        bosh: string | undefined;
        p2p: {
            backToP2PDelay?: number | undefined;
            codecPreferenceOrder?: string[] | undefined;
            enabled?: boolean | undefined;
            iceTransportPolicy?: string | undefined;
            mobileCodecPreferenceOrder?: string[] | undefined;
            stunServers?: {
                urls: string;
            }[] | undefined;
        } | undefined;
        websocket: string | undefined;
    };
    hosts: {
        domain: string;
        muc: string;
    };
    focusUserJid: string;
    disableFocus: boolean;
    disableLocalStats: boolean;
    bosh: string | undefined;
    p2p: {
        enabled: boolean;
        backToP2PDelay?: number | undefined;
        codecPreferenceOrder?: string[] | undefined;
        iceTransportPolicy?: string | undefined;
        mobileCodecPreferenceOrder?: string[] | undefined;
        stunServers?: {
            urls: string;
        }[] | undefined;
    };
    websocket: string | undefined;
} | undefined;
/**
* Returns the UTC timestamp when the first participant joined the conference.
*
* @param {IStateful} stateful - Reference that can be resolved to Redux
* state with the {@code toState} function.
* @returns {number}
*/
export declare function getConferenceTimestamp(stateful: IStateful): number | undefined;
/**
 * Returns the current {@code JitsiConference} which is joining or joined and is
 * not leaving. Please note the contrast with merely reading the
 * {@code conference} state of the feature base/conference which is not joining
 * but may be leaving already.
 *
 * @param {IStateful} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {JitsiConference|undefined}
 */
export declare function getCurrentConference(stateful: IStateful): IJitsiConference | undefined;
/**
 * Returns whether the current conference is a P2P connection.
 * Will return `false` if it's a JVB one, and `null` if there is no conference.
 *
 * @param {IStateful} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean|null}
 */
export declare function isP2pActive(stateful: IStateful): boolean | null;
/**
 * Returns the stored room name.
 *
 * @param {IReduxState} state - The current state of the app.
 * @returns {string}
 */
export declare function getRoomName(state: IReduxState): string | undefined;
/**
 * Get an obfuscated room name or create and persist it if it doesn't exists.
 *
 * @param {IReduxState} state - The current state of the app.
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {string} - Obfuscated room name.
 */
export declare function getOrCreateObfuscatedRoomName(state: IReduxState, dispatch: IStore['dispatch']): string | undefined;
/**
 * Analytics may require an obfuscated room name, this functions decides based on a config if the normal or
 * obfuscated room name should be returned.
 *
 * @param {IReduxState} state - The current state of the app.
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {string} - Analytics room name.
 */
export declare function getAnalyticsRoomName(state: IReduxState, dispatch: IStore['dispatch']): string | undefined;
/**
 * Handle an error thrown by the backend (i.e. {@code lib-jitsi-meet}) while
 * manipulating a conference participant (e.g. Pin or select participant).
 *
 * @param {Error} err - The Error which was thrown by the backend while
 * manipulating a conference participant and which is to be handled.
 * @protected
 * @returns {void}
 */
export declare function _handleParticipantError(err: Error): void;
/**
 * Determines whether a specific string is a valid room name.
 *
 * @param {(string|undefined)} room - The name of the conference room to check
 * for validity.
 * @returns {boolean} If the specified room name is valid, then true; otherwise,
 * false.
 */
export declare function isRoomValid(room?: string): boolean;
/**
 * Remove a set of local tracks from a conference.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @param {JitsiLocalTrack[]} localTracks - List of local media tracks.
 * @protected
 * @returns {Promise}
 */
export declare function _removeLocalTracksFromConference(conference: IJitsiConference, localTracks: Array<Object>): Promise<any[]>;
/**
 * Sends a representation of the local participant such as her avatar (URL),
 * email address, and display name to (the remote participants of) a specific
 * conference.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @param {JitsiConference} conference - The {@code JitsiConference} to which
 * the representation of the local participant is to be sent.
 * @returns {void}
 */
export declare function sendLocalParticipant(stateful: IStateful, conference?: IJitsiConference): void;
