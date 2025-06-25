import { IReduxState } from '../app/types';
/**
 * Selector for the participant currently displaying on the large video.
 *
 * @param {Object} state - The redux state.
 * @returns {Object}
 */
export declare function getLargeVideoParticipant(state: IReduxState): import("../base/participants/types").IParticipant | undefined;
