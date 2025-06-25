import { IReduxState, IStore } from '../app/types';
/**
 * Computes the reorderd list of the remote participants.
 *
 * @param {*} store - The redux store.
 * @param {boolean} force - Does not short circuit, the execution, make execute all checks.
 * @param {string} participantId - The endpoint id of the participant that joined the call.
 * @returns {void}
 * @private
 */
export declare function updateRemoteParticipants(store: IStore, force?: boolean, participantId?: string): void;
/**
 * Private helper to calculate the reordered list of remote participants when a participant leaves.
 *
 * @param {*} store - The redux store.
 * @param {string} participantId - The endpoint id of the participant leaving the call.
 * @returns {void}
 * @private
 */
export declare function updateRemoteParticipantsOnLeave(store: IStore, participantId?: string | null): void;
/**
 * Returns whether tileview is completely disabled.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {boolean} - Whether tileview is completely disabled.
 */
export declare function isTileViewModeDisabled(state: IReduxState): boolean | undefined;
