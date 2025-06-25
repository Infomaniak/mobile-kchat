import 'image-capture';
import './createImageBitmap';
import { IStore } from '../app/types';
/**
 * Class for face language detection.
 */
declare class FaceLandmarksDetector {
    private static instance;
    private initialized;
    private imageCapture;
    private worker;
    private lastFaceExpression;
    private lastFaceExpressionTimestamp;
    private webhookSendInterval;
    private detectionInterval;
    private recognitionActive;
    private canvas?;
    private context?;
    private errorCount;
    private noDetectionCount;
    private noDetectionStartTimestamp;
    /**
     * Constructor for class, checks if the environment supports OffscreenCanvas.
    */
    private constructor();
    /**
     * Function for retrieving the FaceLandmarksDetector instance.
     *
     * @returns {FaceLandmarksDetector} - FaceLandmarksDetector instance.
     */
    static getInstance(): FaceLandmarksDetector;
    /**
     * Returns if the detected environment is initialized.
     *
     * @returns {boolean}
     */
    isInitialized(): boolean;
    /**
     * Initialization function: the worker is loaded and initialized, and then if possible the detection stats.
     *
     * @param {IStore} store - Redux store with dispatch and getState methods.
     * @returns {void}
    */
    init({ dispatch, getState }: IStore): void;
    /**
     * The function which starts the detection process.
     *
     * @param {IStore} store - Redux store with dispatch and getState methods.
     * @param {any} track - Track from middleware; can be undefined.
     * @returns {void}
    */
    startDetection({ dispatch, getState }: IStore, track?: any): void;
    /**
     * The function which stops the detection process.
     *
     * @param {IStore} store - Redux store with dispatch and getState methods.
     * @returns {void}
    */
    stopDetection({ dispatch, getState }: IStore): void;
    /**
     * Dispatches the action for adding new face landmarks and changes the state of the class.
     *
     * @param {IStore.dispatch} dispatch - The redux dispatch function.
     * @param {number} endTimestamp - The timestamp when the face landmarks ended.
     * @param {string} newFaceExpression - The new face expression.
     * @param {boolean} addToBuffer - Flag for adding the face landmarks to the buffer.
     * @returns {void}
     */
    private addFaceLandmarks;
    /**
     * Sends the image data a canvas from the track in the image capture to the face detection worker.
     *
     * @param {number} faceCenteringThreshold  - Movement threshold as percentage for sharing face coordinates.
     * @returns {Promise<boolean>} - True if sent, false otherwise.
     */
    private sendDataToWorker;
}
declare const _default: FaceLandmarksDetector;
export default _default;
