"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitFeedback = exports.sendJaasFeedbackMetadata = exports.openFeedbackDialog = exports.maybeOpenFeedbackDialog = exports.cancelFeedback = void 0;
// @ts-expect-error
const UIErrors_1 = require("../../../modules/UI/UIErrors");
const actions_1 = require("../base/dialog/actions");
const functions_any_1 = require("../dynamic-branding/functions.any");
const actionTypes_1 = require("./actionTypes");
const FeedbackDialog_web_1 = __importDefault(require("./components/FeedbackDialog.web"));
const functions_web_1 = require("./functions.web");
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
function cancelFeedback(score, message) {
    return {
        type: actionTypes_1.CANCEL_FEEDBACK,
        message,
        score
    };
}
exports.cancelFeedback = cancelFeedback;
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
function maybeOpenFeedbackDialog(conference, title) {
    return (dispatch, getState) => {
        const state = getState();
        const { feedbackPercentage = 100 } = state['features/base/config'];
        if (config.iAmRecorder) {
            // Intentionally fall through the if chain to prevent further action
            // from being taken with regards to showing feedback.
        }
        else if (state['features/base/dialog'].component === FeedbackDialog_web_1.default) {
            // Feedback is currently being displayed.
            return Promise.reject(UIErrors_1.FEEDBACK_REQUEST_IN_PROGRESS);
        }
        else if (state['features/feedback'].submitted) {
            // Feedback has been submitted already.
            return Promise.resolve({
                feedbackSubmitted: true,
                showThankYou: true,
                wasDialogShown: false
            });
        }
        else if ((0, functions_web_1.shouldSendJaaSFeedbackMetadata)(state)
            && feedbackPercentage > Math.random() * 100) {
            return new Promise(resolve => {
                dispatch(openFeedbackDialog(conference, title, () => {
                    const { submitted } = getState()['features/feedback'];
                    resolve({
                        feedbackSubmitted: submitted,
                        showThankYou: false,
                        wasDialogShown: true
                    });
                }));
            });
        }
        // If the feedback functionality isn't enabled we show a "thank you"
        // message. Signaling it (true), so the caller of requestFeedback can
        // act on it.
        return Promise.resolve({
            feedbackSubmitted: false,
            showThankYou: true,
            wasDialogShown: false
        });
    };
}
exports.maybeOpenFeedbackDialog = maybeOpenFeedbackDialog;
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
function openFeedbackDialog(conference, title, onClose) {
    return (0, actions_1.openDialog)(FeedbackDialog_web_1.default, {
        conference,
        onClose,
        title
    });
}
exports.openFeedbackDialog = openFeedbackDialog;
/**
 * Sends feedback metadata to JaaS endpoint.
 *
 * @param {JitsiConference} conference - The JitsiConference that is being rated.
 * @param {Object} feedback - The feedback message and score.
 *
 * @returns {Promise}
 */
function sendJaasFeedbackMetadata(conference, feedback) {
    return (_dispatch, getState) => {
        const state = getState();
        if (!(0, functions_web_1.shouldSendJaaSFeedbackMetadata)(state)) {
            return Promise.resolve();
        }
        const { jaasFeedbackMetadataURL } = state['features/base/config'];
        const { jwt, user, tenant } = state['features/base/jwt'];
        const meetingFqn = (0, functions_any_1.extractFqnFromPath)();
        const feedbackData = {
            ...feedback,
            sessionId: conference.sessionId,
            userId: user?.id,
            meetingFqn,
            jwt,
            tenant
        };
        return (0, functions_web_1.sendFeedbackToJaaSRequest)(jaasFeedbackMetadataURL, feedbackData);
    };
}
exports.sendJaasFeedbackMetadata = sendJaasFeedbackMetadata;
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
function submitFeedback(score, message, conference) {
    return (dispatch, getState) => {
        const state = getState();
        const promises = [];
        if ((0, functions_web_1.shouldSendJaaSFeedbackMetadata)(state)) {
            promises.push(dispatch(sendJaasFeedbackMetadata(conference, {
                score,
                message
            })));
        }
        return Promise.allSettled(promises)
            .then(results => {
            const rejected = results.find((result) => result?.status === 'rejected');
            if (typeof rejected === 'undefined') {
                dispatch({ type: actionTypes_1.SUBMIT_FEEDBACK_SUCCESS });
                return Promise.resolve();
            }
            const error = rejected.reason;
            dispatch({
                type: actionTypes_1.SUBMIT_FEEDBACK_ERROR,
                error
            });
            return Promise.reject(error);
        });
    };
}
exports.submitFeedback = submitFeedback;
