/// <reference types="react" />
import { IStore } from '../app/types';
import { IJitsiConference } from '../base/conference/reducer';
/**
 * Caches the passed in feedback in the redux store.
 *
 * @param {number} score - The quality score given to the conference.
 * @param {string} message - A description entered by the participant that
 * explains the rating.
 * @returns {{
 *     type: CANCEL_FEEDBACK,
 *     message: string,
 *     score: number
 * }}
 */
export declare function cancelFeedback(score: number, message: string): {
    type: string;
    message: string;
    score: number;
};
/**
 * Potentially open the {@code FeedbackDialog}. It will not be opened if it is
 * already open or feedback has already been submitted.
 *
 * @param {JistiConference} conference - The conference for which the feedback
 * would be about. The conference is passed in because feedback can occur after
 * a conference has been left, so references to it may no longer exist in redux.
 * @param {string} title - The feedback dialog title.
 * @returns {Promise} Resolved with value - false if the dialog is enabled and
 * resolved with true if the dialog is disabled or the feedback was already
 * submitted. Rejected if another dialog is already displayed.
 */
export declare function maybeOpenFeedbackDialog(conference: IJitsiConference, title?: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<{
    feedbackSubmitted: boolean;
    showThankYou: boolean;
    wasDialogShown: boolean;
}>;
/**
 * Opens {@code FeedbackDialog}.
 *
 * @param {JitsiConference} conference - The JitsiConference that is being
 * rated. The conference is passed in because feedback can occur after a
 * conference has been left, so references to it may no longer exist in redux.
 * @param {string} [title] - The feedback dialog title.
 * @param {Function} [onClose] - An optional callback to invoke when the dialog
 * is closed.
 * @returns {Object}
 */
export declare function openFeedbackDialog(conference?: IJitsiConference, title?: string, onClose?: Function): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
/**
 * Sends feedback metadata to JaaS endpoint.
 *
 * @param {JitsiConference} conference - The JitsiConference that is being rated.
 * @param {Object} feedback - The feedback message and score.
 *
 * @returns {Promise}
 */
export declare function sendJaasFeedbackMetadata(conference: IJitsiConference, feedback: Object): (_dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Send the passed in feedback.
 *
 * @param {number} score - An integer between 1 and 5 indicating the user
 * feedback. The negative integer -1 is used to denote no score was selected.
 * @param {string} message - Detailed feedback from the user to explain the
 * rating.
 * @param {JitsiConference} conference - The JitsiConference for which the
 * feedback is being left.
 * @returns {Function}
 */
export declare function submitFeedback(score: number, message: string, conference: IJitsiConference): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
