"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("image-capture");
require("./createImageBitmap");
const utils_1 = require("../base/environment/utils");
const functions_1 = require("../base/tracks/functions");
const helpers_1 = require("../base/util/helpers");
const actions_1 = require("./actions");
const constants_1 = require("./constants");
const functions_2 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Class for face language detection.
 */
class FaceLandmarksDetector {
    /**
     * Constructor for class, checks if the environment supports OffscreenCanvas.
    */
    constructor() {
        this.initialized = false;
        this.imageCapture = null;
        this.worker = null;
        this.lastFaceExpression = null;
        this.lastFaceExpressionTimestamp = null;
        this.webhookSendInterval = null;
        this.detectionInterval = null;
        this.recognitionActive = false;
        this.errorCount = 0;
        this.noDetectionCount = 0;
        this.noDetectionStartTimestamp = null;
        if (typeof OffscreenCanvas === 'undefined') {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
        }
    }
    /**
     * Function for retrieving the FaceLandmarksDetector instance.
     *
     * @returns {FaceLandmarksDetector} - FaceLandmarksDetector instance.
     */
    static getInstance() {
        if (!FaceLandmarksDetector.instance) {
            FaceLandmarksDetector.instance = new FaceLandmarksDetector();
        }
        return FaceLandmarksDetector.instance;
    }
    /**
     * Returns if the detected environment is initialized.
     *
     * @returns {boolean}
     */
    isInitialized() {
        return this.initialized;
    }
    /**
     * Initialization function: the worker is loaded and initialized, and then if possible the detection stats.
     *
     * @param {IStore} store - Redux store with dispatch and getState methods.
     * @returns {void}
    */
    init({ dispatch, getState }) {
        if (this.isInitialized()) {
            logger_1.default.info('Worker has already been initialized');
            return;
        }
        if ((0, utils_1.isMobileBrowser)() || navigator.product === 'ReactNative') {
            logger_1.default.warn('Unsupported environment for face detection');
            return;
        }
        const baseUrl = `${(0, helpers_1.getBaseUrl)()}libs/`;
        let workerUrl = `${baseUrl}face-landmarks-worker.min.js`;
        // @ts-ignore
        const workerBlob = new Blob([`importScripts("${workerUrl}");`], { type: 'application/javascript' });
        const state = getState();
        const addToBuffer = Boolean(state['features/base/config'].webhookProxyUrl);
        // @ts-ignore
        workerUrl = window.URL.createObjectURL(workerBlob);
        this.worker = new Worker(workerUrl, { name: 'Face Landmarks Worker' });
        this.worker.onmessage = ({ data }) => {
            const { faceExpression, faceBox, faceCount } = data;
            const messageTimestamp = Date.now();
            // if the number of faces detected is different from 1 we do not take into consideration that detection
            if (faceCount !== 1) {
                if (this.noDetectionCount === 0) {
                    this.noDetectionStartTimestamp = messageTimestamp;
                }
                this.noDetectionCount++;
                if (this.noDetectionCount === constants_1.NO_FACE_DETECTION_THRESHOLD && this.noDetectionStartTimestamp) {
                    this.addFaceLandmarks(dispatch, this.noDetectionStartTimestamp, constants_1.NO_DETECTION, addToBuffer);
                }
                return;
            }
            else if (this.noDetectionCount > 0) {
                this.noDetectionCount = 0;
                this.noDetectionStartTimestamp = null;
            }
            if (faceExpression?.expression) {
                const { expression } = faceExpression;
                if (expression !== this.lastFaceExpression) {
                    this.addFaceLandmarks(dispatch, messageTimestamp, expression, addToBuffer);
                }
            }
            if (faceBox) {
                dispatch((0, actions_1.newFaceBox)(faceBox));
            }
            APP.API.notifyFaceLandmarkDetected(faceBox, faceExpression);
        };
        const { faceLandmarks } = state['features/base/config'];
        const detectionTypes = [
            faceLandmarks?.enableFaceCentering && constants_1.DETECTION_TYPES.FACE_BOX,
            faceLandmarks?.enableFaceExpressionsDetection && constants_1.DETECTION_TYPES.FACE_EXPRESSIONS
        ].filter(Boolean);
        this.worker.postMessage({
            type: constants_1.INIT_WORKER,
            baseUrl,
            detectionTypes
        });
        this.initialized = true;
        this.startDetection({
            dispatch,
            getState
        });
    }
    /**
     * The function which starts the detection process.
     *
     * @param {IStore} store - Redux store with dispatch and getState methods.
     * @param {any} track - Track from middleware; can be undefined.
     * @returns {void}
    */
    startDetection({ dispatch, getState }, track) {
        if (!this.isInitialized()) {
            logger_1.default.info('Worker has not been initialized');
            return;
        }
        if (this.recognitionActive) {
            logger_1.default.log('Face landmarks detection already active.');
            return;
        }
        const state = getState();
        const localVideoTrack = track || (0, functions_1.getLocalVideoTrack)(state['features/base/tracks']);
        if (localVideoTrack === undefined) {
            logger_1.default.warn('Face landmarks detection is disabled due to missing local track.');
            return;
        }
        const stream = localVideoTrack.jitsiTrack.getOriginalStream();
        const firstVideoTrack = stream.getVideoTracks()[0];
        this.imageCapture = new ImageCapture(firstVideoTrack);
        this.recognitionActive = true;
        logger_1.default.log('Start face landmarks detection');
        const { faceLandmarks } = state['features/base/config'];
        this.detectionInterval = window.setInterval(() => {
            if (this.worker && this.imageCapture) {
                this.sendDataToWorker(faceLandmarks?.faceCenteringThreshold).then(status => {
                    if (status) {
                        this.errorCount = 0;
                    }
                    else if (++this.errorCount > constants_1.FACE_LANDMARKS_DETECTION_ERROR_THRESHOLD) {
                        /* this prevents the detection from stopping immediately after occurring an error
                         * sometimes due to the small detection interval when starting the detection some errors
                         * might occur due to the track not being ready
                        */
                        this.stopDetection({
                            dispatch,
                            getState
                        });
                    }
                });
            }
        }, (0, functions_2.getDetectionInterval)(state));
        const { webhookProxyUrl } = state['features/base/config'];
        if (faceLandmarks?.enableFaceExpressionsDetection && webhookProxyUrl) {
            this.webhookSendInterval = window.setInterval(async () => {
                const result = await (0, functions_2.sendFaceExpressionsWebhook)(getState());
                if (result) {
                    dispatch((0, actions_1.clearFaceExpressionBuffer)());
                }
            }, constants_1.WEBHOOK_SEND_TIME_INTERVAL);
        }
    }
    /**
     * The function which stops the detection process.
     *
     * @param {IStore} store - Redux store with dispatch and getState methods.
     * @returns {void}
    */
    stopDetection({ dispatch, getState }) {
        if (!this.recognitionActive || !this.isInitialized()) {
            return;
        }
        const stopTimestamp = Date.now();
        const addToBuffer = Boolean(getState()['features/base/config'].webhookProxyUrl);
        if (this.lastFaceExpression && this.lastFaceExpressionTimestamp) {
            this.addFaceLandmarks(dispatch, stopTimestamp, null, addToBuffer);
        }
        this.webhookSendInterval && window.clearInterval(this.webhookSendInterval);
        this.detectionInterval && window.clearInterval(this.detectionInterval);
        this.webhookSendInterval = null;
        this.detectionInterval = null;
        this.imageCapture = null;
        this.recognitionActive = false;
        logger_1.default.log('Stop face landmarks detection');
    }
    /**
     * Dispatches the action for adding new face landmarks and changes the state of the class.
     *
     * @param {IStore.dispatch} dispatch - The redux dispatch function.
     * @param {number} endTimestamp - The timestamp when the face landmarks ended.
     * @param {string} newFaceExpression - The new face expression.
     * @param {boolean} addToBuffer - Flag for adding the face landmarks to the buffer.
     * @returns {void}
     */
    addFaceLandmarks(dispatch, endTimestamp, newFaceExpression, addToBuffer = false) {
        if (this.lastFaceExpression && this.lastFaceExpressionTimestamp) {
            dispatch((0, actions_1.addFaceLandmarks)({
                duration: endTimestamp - this.lastFaceExpressionTimestamp,
                faceExpression: this.lastFaceExpression,
                timestamp: this.lastFaceExpressionTimestamp
            }, addToBuffer));
        }
        this.lastFaceExpression = newFaceExpression;
        this.lastFaceExpressionTimestamp = endTimestamp;
    }
    /**
     * Sends the image data a canvas from the track in the image capture to the face detection worker.
     *
     * @param {number} faceCenteringThreshold  - Movement threshold as percentage for sharing face coordinates.
     * @returns {Promise<boolean>} - True if sent, false otherwise.
     */
    async sendDataToWorker(faceCenteringThreshold = 10) {
        if (!this.imageCapture
            || !this.worker
            || !this.imageCapture) {
            logger_1.default.log('Environment not ready! Could not send data to worker');
            return false;
        }
        // if ImageCapture is polyfilled then it would not have the track,
        // so there would be no point in checking for its readyState
        if (this.imageCapture.track && this.imageCapture.track.readyState !== 'live') {
            logger_1.default.log('Track not ready! Could not send data to worker');
            return false;
        }
        let imageBitmap;
        let image;
        try {
            imageBitmap = await this.imageCapture.grabFrame();
        }
        catch (err) {
            logger_1.default.log('Could not send data to worker');
            return false;
        }
        if (typeof OffscreenCanvas === 'undefined' && this.canvas && this.context) {
            this.canvas.width = imageBitmap.width;
            this.canvas.height = imageBitmap.height;
            this.context.drawImage(imageBitmap, 0, 0);
            image = this.context.getImageData(0, 0, imageBitmap.width, imageBitmap.height);
        }
        else {
            image = imageBitmap;
        }
        this.worker.postMessage({
            type: constants_1.DETECT_FACE,
            image,
            threshold: faceCenteringThreshold
        });
        imageBitmap.close();
        return true;
    }
}
exports.default = FaceLandmarksDetector.getInstance();
