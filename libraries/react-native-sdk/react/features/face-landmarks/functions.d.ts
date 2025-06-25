import { IReduxState } from '../app/types';
import { IJitsiConference } from '../base/conference/reducer';
import { FaceBox, FaceLandmarks } from './types';
/**
 * Sends the face landmarks to other participants via the data channel.
 *
 * @param {any} conference - The current conference.
 * @param  {FaceLandmarks} faceLandmarks - Face landmarks to be sent.
 * @returns {void}
 */
export declare function sendFaceExpressionToParticipants(conference: any, faceLandmarks: FaceLandmarks): void;
/**
 * Sends the face box to all the other participants.
 *
 * @param {any} conference - The current conference.
 * @param  {FaceBox} faceBox - Face box to be sent.
 * @returns {void}
 */
export declare function sendFaceBoxToParticipants(conference: any, faceBox: FaceBox): void;
/**
 * Sends the face landmarks to prosody.
 *
 * @param {any} conference - The current conference.
 * @param  {FaceLandmarks} faceLandmarks - Face landmarks to be sent.
 * @returns {void}
 */
export declare function sendFaceExpressionToServer(conference: IJitsiConference | undefined, faceLandmarks: FaceLandmarks): void;
/**
 * Sends face landmarks to backend.
 *
 * @param  {Object} state - Redux state.
 * @returns {boolean} - True if sent, false otherwise.
 */
export declare function sendFaceExpressionsWebhook(state: IReduxState): Promise<boolean>;
/**
 * Gets the video object position for a participant id.
 *
 * @param {IReduxState} state - The redux state.
 * @param {string} id - The participant id.
 * @returns {string} - CSS object-position in the shape of '{horizontalPercentage}% {verticalPercentage}%'.
 */
export declare function getVideoObjectPosition(state: IReduxState, id?: string): string;
/**
 * Gets the video object position for a participant id.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {number} - Number of milliseconds for doing face detection.
 */
export declare function getDetectionInterval(state: IReduxState): number;
