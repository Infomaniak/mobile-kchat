/// <reference types="w3c-image-capture" />
import 'image-capture';
import './createImageBitmap';
import { IReduxState } from '../app/types';
/**
 * Effect that wraps {@code MediaStream} adding periodic screenshot captures.
 * Manipulates the original desktop stream and performs custom processing operations, if implemented.
 */
export default class ScreenshotCaptureSummary {
    _state: IReduxState;
    _initializedRegion: boolean;
    _imageCapture: ImageCapture;
    _streamWorker: Worker;
    _queue: Blob[];
    /**
     * Initializes a new {@code ScreenshotCaptureEffect} instance.
     *
     * @param {Object} state - The redux state.
     */
    constructor(state: IReduxState);
    /**
     * Make a call to backend for region selection.
     *
     * @returns {void}
     */
    _initRegionSelection(): Promise<void>;
    /**
     * Starts the screenshot capture event on a loop.
     *
     * @param {JitsiTrack} jitsiTrack - The track that contains the stream from which screenshots are to be sent.
     * @returns {Promise} - Promise that resolves once effect has started or rejects if the
     * videoType parameter is not desktop.
     */
    start(jitsiTrack: any): Promise<void>;
    /**
     * Stops the ongoing {@code ScreenshotCaptureEffect} by clearing the {@code Worker} interval.
     *
     * @returns {void}
     */
    stop(): void;
    /**
     * Sends to worker the imageBitmap for the next timeout.
     *
     * @returns {Promise<void>}
     */
    sendTimeout(): Promise<void>;
    /**
     * Handler of the {@code EventHandler} message that calls the appropriate method based on the parameter's id.
     *
     * @private
     * @param {EventHandler} message - Message received from the Worker.
     * @returns {void}
     */
    _handleWorkerAction(message: {
        data: {
            id: number;
            imageBlob?: Blob;
        };
    }): void;
    /**
     * Method that processes the screenshot.
     *
     * @private
     * @param {Blob} imageBlob - The blob for the current screenshot.
     * @returns {void}
     */
    _doProcessScreenshot(imageBlob: Blob): void;
}
