import 'image-capture';
import './createImageBitmap';
import { AnyAction } from 'redux';
import { FaceBox, FaceLandmarks } from './types';
/**
 * Adds new face landmarks to the timeline.
 *
 * @param {FaceLandmarks} faceLandmarks - The new face landmarks to timeline.
 * @param {boolean} addToBuffer - If true adds the face landmarks to a buffer in the reducer for webhook.
 * @returns {AnyAction}
 */
export declare function addFaceLandmarks(faceLandmarks: FaceLandmarks, addToBuffer: boolean): AnyAction;
/**
 * Clears the face landmarks array in the state.
 *
 * @returns {AnyAction}
 */
export declare function clearFaceExpressionBuffer(): AnyAction;
/**
 * Signals that a new face box was obtained for the local participant.
 *
 * @param {FaceBox} faceBox - The face box of the local participant.
 * @returns {AnyAction}
 */
export declare function newFaceBox(faceBox: FaceBox): AnyAction;
