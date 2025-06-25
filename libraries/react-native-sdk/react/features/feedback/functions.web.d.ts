import { IReduxState } from '../app/types';
/**
 * Sends feedback metadata to JaaS endpoints.
 *
 * @param {string|undefined} url - The JaaS metadata endpoint URL.
 * @param {Object} feedbackData - The feedback data object.
 * @returns {Promise}
 */
export declare function sendFeedbackToJaaSRequest(url: string | undefined, feedbackData: {
    jwt?: string;
    meetingFqn: string;
    message?: string;
    score?: number;
    sessionId: string;
    tenant?: string;
    userId?: string;
}): Promise<void>;
/**
 * Returns whether jaas feedback metadata should be send or not.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if jaas feedback metadata should be send and false otherwise.
 */
export declare function shouldSendJaaSFeedbackMetadata(state: IReduxState): boolean;
