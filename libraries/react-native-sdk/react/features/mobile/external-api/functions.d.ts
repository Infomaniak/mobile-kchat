import { IParticipant } from '../../base/participants/types';
/**
 * Sends a specific event to the native counterpart of the External API. Native
 * apps may listen to such events via the mechanisms provided by the (native)
 * mobile Jitsi Meet SDK.
 *
 * @param {Object} store - The redux store.
 * @param {string} name - The name of the event to send.
 * @param {Object} data - The details/specifics of the event to send determined
 * by/associated with the specified {@code name}.
 * @returns {void}
 */
export declare function sendEvent(store: Object, name: string, data: Object): void;
/**
 * Debounced sending of `readyToClose`.
 */
export declare const _sendReadyToClose: import("lodash").DebouncedFuncLeading<(dispatch: any) => void>;
/**
 * Returns a participant info object based on the passed participant object from redux.
 *
 * @param {Participant} participant - The participant object from the redux store.
 * @returns {Object} - The participant info object.
 */
export declare function participantToParticipantInfo(participant: IParticipant): {
    isLocal: boolean | undefined;
    email: string | undefined;
    name: string | undefined;
    participantId: string;
    displayName: string | undefined;
    avatarUrl: string | undefined;
    role: string | undefined;
};
