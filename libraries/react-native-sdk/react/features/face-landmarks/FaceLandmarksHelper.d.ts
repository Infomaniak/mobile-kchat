import { FaceResult, Human } from '@vladmandic/human';
import { DetectInput, DetectOutput, FaceBox, FaceExpression, InitInput } from './types';
export interface IFaceLandmarksHelper {
    detect: ({ image, threshold }: DetectInput) => Promise<DetectOutput>;
    getDetectionInProgress: () => boolean;
    getDetections: (image: ImageBitmap | ImageData) => Promise<Array<FaceResult>>;
    getFaceBox: (detections: Array<FaceResult>, threshold: number) => FaceBox | undefined;
    getFaceCount: (detections: Array<FaceResult>) => number;
    getFaceExpression: (detections: Array<FaceResult>) => FaceExpression | undefined;
    init: () => Promise<void>;
}
/**
 * Helper class for human library.
 */
export declare class HumanHelper implements IFaceLandmarksHelper {
    protected human: Human | undefined;
    protected faceDetectionTypes: string[];
    protected baseUrl: string;
    private detectionInProgress;
    private lastValidFaceBox;
    /**
    * Configuration for human.
    */
    private config;
    /**
     * Constructor function for the helper which initialize the helper.
     *
     * @param  {InitInput} input - The input for the helper.
     * @returns {void}
     */
    constructor({ baseUrl, detectionTypes }: InitInput);
    /**
     * Initializes the human helper with the available tfjs backend for the given detection types.
     *
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * Gets the face box from the detections, if there is no valid detections it will return undefined..
     *
     * @param {Array<FaceResult>} detections - The array with the detections.
     * @param {number} threshold - Face box position change threshold.
     * @returns {FaceBox | undefined}
     */
    getFaceBox(detections: Array<FaceResult>, threshold: number): FaceBox | undefined;
    /**
     * Gets the face expression from the detections, if there is no valid detections it will return undefined.
     *
     * @param {Array<FaceResult>} detections - The array with the detections.
     * @returns {string | undefined}
     */
    getFaceExpression(detections: Array<FaceResult>): FaceExpression | undefined;
    /**
     * Gets the face count from the detections, which is the number of detections.
     *
     * @param {Array<FaceResult>} detections - The array with the detections.
     * @returns {number}
     */
    getFaceCount(detections: Array<FaceResult> | undefined): number;
    /**
     * Gets the detections from the image captured from the track.
     *
     * @param {ImageBitmap | ImageData} image - The image captured from the track,
     * if OffscreenCanvas available it will be ImageBitmap, otherwise it will be ImageData.
     * @returns {Promise<Array<FaceResult>>}
     */
    getDetections(image: ImageBitmap | ImageData): Promise<Array<FaceResult>>;
    /**
     * Gathers together all the data from the detections, it's the function that will be called in the worker.
     *
     * @param {DetectInput} input - The input for the detections.
     * @returns {Promise<DetectOutput>}
     */
    detect({ image, threshold }: DetectInput): Promise<DetectOutput>;
    /**
     * Returns the detection state.
     *
     * @returns {boolean}
     */
    getDetectionInProgress(): boolean;
}
