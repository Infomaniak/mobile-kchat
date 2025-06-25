"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../virtual-background/constants");
const TimerWorker_1 = require("./TimerWorker");
/**
 * Represents a modified MediaStream that adds effects to video background.
 * <tt>JitsiStreamBackgroundEffect</tt> does the processing of the original
 * video stream.
 */
class JitsiStreamBackgroundEffect {
    /**
     * Represents a modified video MediaStream track.
     *
     * @class
     * @param {Object} model - Meet model.
     * @param {Object} options - Segmentation dimensions.
     */
    constructor(model, options) {
        this._options = options;
        if (this._options.virtualBackground.backgroundType === constants_1.VIRTUAL_BACKGROUND_TYPE.IMAGE) {
            this._virtualImage = document.createElement('img');
            this._virtualImage.crossOrigin = 'anonymous';
            this._virtualImage.src = this._options.virtualBackground.virtualSource ?? '';
        }
        this._model = model;
        this._segmentationPixelCount = this._options.width * this._options.height;
        // Bind event handler so it is only bound once for every instance.
        this._onMaskFrameTimer = this._onMaskFrameTimer.bind(this);
        // Workaround for FF issue https://bugzilla.mozilla.org/show_bug.cgi?id=1388974
        this._outputCanvasElement = document.createElement('canvas');
        this._outputCanvasElement.getContext('2d');
        this._inputVideoElement = document.createElement('video');
    }
    /**
     * EventHandler onmessage for the maskFrameTimerWorker WebWorker.
     *
     * @private
     * @param {EventHandler} response - The onmessage EventHandler parameter.
     * @returns {void}
     */
    _onMaskFrameTimer(response) {
        if (response.data.id === TimerWorker_1.TIMEOUT_TICK) {
            this._renderMask();
        }
    }
    /**
     * Represents the run post processing.
     *
     * @returns {void}
     */
    runPostProcessing() {
        const track = this._stream.getVideoTracks()[0];
        const { height, width } = track.getSettings() ?? track.getConstraints();
        const { backgroundType } = this._options.virtualBackground;
        if (!this._outputCanvasCtx) {
            return;
        }
        this._outputCanvasElement.height = height;
        this._outputCanvasElement.width = width;
        this._outputCanvasCtx.globalCompositeOperation = 'copy';
        // Draw segmentation mask.
        // Smooth out the edges.
        this._outputCanvasCtx.filter = backgroundType === constants_1.VIRTUAL_BACKGROUND_TYPE.IMAGE ? 'blur(4px)' : 'blur(8px)';
        this._outputCanvasCtx?.drawImage(// @ts-ignore
        this._segmentationMaskCanvas, 0, 0, this._options.width, this._options.height, 0, 0, this._inputVideoElement.width, this._inputVideoElement.height);
        this._outputCanvasCtx.globalCompositeOperation = 'source-in';
        this._outputCanvasCtx.filter = 'none';
        // Draw the foreground video.
        // @ts-ignore
        this._outputCanvasCtx?.drawImage(this._inputVideoElement, 0, 0);
        // Draw the background.
        this._outputCanvasCtx.globalCompositeOperation = 'destination-over';
        if (backgroundType === constants_1.VIRTUAL_BACKGROUND_TYPE.IMAGE) {
            this._outputCanvasCtx?.drawImage(// @ts-ignore
            backgroundType === constants_1.VIRTUAL_BACKGROUND_TYPE.IMAGE
                ? this._virtualImage : this._virtualVideo, 0, 0, this._outputCanvasElement.width, this._outputCanvasElement.height);
        }
        else {
            this._outputCanvasCtx.filter = `blur(${this._options.virtualBackground.blurValue}px)`;
            // @ts-ignore
            this._outputCanvasCtx?.drawImage(this._inputVideoElement, 0, 0);
        }
    }
    /**
     * Represents the run Tensorflow Interference.
     *
     * @returns {void}
     */
    runInference() {
        this._model._runInference();
        const outputMemoryOffset = this._model._getOutputMemoryOffset() / 4;
        for (let i = 0; i < this._segmentationPixelCount; i++) {
            const person = this._model.HEAPF32[outputMemoryOffset + i];
            // Sets only the alpha component of each pixel.
            this._segmentationMask.data[(i * 4) + 3] = 255 * person;
        }
        this._segmentationMaskCtx?.putImageData(this._segmentationMask, 0, 0);
    }
    /**
     * Loop function to render the background mask.
     *
     * @private
     * @returns {void}
     */
    _renderMask() {
        this.resizeSource();
        this.runInference();
        this.runPostProcessing();
        this._maskFrameTimerWorker.postMessage({
            id: TimerWorker_1.SET_TIMEOUT,
            timeMs: 1000 / 30
        });
    }
    /**
     * Represents the resize source process.
     *
     * @returns {void}
     */
    resizeSource() {
        this._segmentationMaskCtx?.drawImage(// @ts-ignore
        this._inputVideoElement, 0, 0, this._inputVideoElement.width, this._inputVideoElement.height, 0, 0, this._options.width, this._options.height);
        const imageData = this._segmentationMaskCtx?.getImageData(0, 0, this._options.width, this._options.height);
        const inputMemoryOffset = this._model._getInputMemoryOffset() / 4;
        for (let i = 0; i < this._segmentationPixelCount; i++) {
            this._model.HEAPF32[inputMemoryOffset + (i * 3)] = Number(imageData?.data[i * 4]) / 255;
            this._model.HEAPF32[inputMemoryOffset + (i * 3) + 1] = Number(imageData?.data[(i * 4) + 1]) / 255;
            this._model.HEAPF32[inputMemoryOffset + (i * 3) + 2] = Number(imageData?.data[(i * 4) + 2]) / 255;
        }
    }
    /**
     * Checks if the local track supports this effect.
     *
     * @param {JitsiLocalTrack} jitsiLocalTrack - Track to apply effect.
     * @returns {boolean} - Returns true if this effect can run on the specified track
     * false otherwise.
     */
    isEnabled(jitsiLocalTrack) {
        return jitsiLocalTrack.isVideoTrack() && jitsiLocalTrack.videoType === 'camera';
    }
    /**
     * Starts loop to capture video frame and render the segmentation mask.
     *
     * @param {MediaStream} stream - Stream to be used for processing.
     * @returns {MediaStream} - The stream with the applied effect.
     */
    startEffect(stream) {
        this._stream = stream;
        this._maskFrameTimerWorker = new Worker(TimerWorker_1.timerWorkerScript, { name: 'Blur effect worker' });
        this._maskFrameTimerWorker.onmessage = this._onMaskFrameTimer;
        const firstVideoTrack = this._stream.getVideoTracks()[0];
        const { height, frameRate, width } = firstVideoTrack.getSettings ? firstVideoTrack.getSettings() : firstVideoTrack.getConstraints();
        this._segmentationMask = new ImageData(this._options.width, this._options.height);
        this._segmentationMaskCanvas = document.createElement('canvas');
        this._segmentationMaskCanvas.width = this._options.width;
        this._segmentationMaskCanvas.height = this._options.height;
        this._segmentationMaskCtx = this._segmentationMaskCanvas.getContext('2d');
        this._outputCanvasElement.width = parseInt(width, 10);
        this._outputCanvasElement.height = parseInt(height, 10);
        this._outputCanvasCtx = this._outputCanvasElement.getContext('2d');
        this._inputVideoElement.width = parseInt(width, 10);
        this._inputVideoElement.height = parseInt(height, 10);
        this._inputVideoElement.autoplay = true;
        this._inputVideoElement.srcObject = this._stream;
        this._inputVideoElement.onloadeddata = () => {
            this._maskFrameTimerWorker.postMessage({
                id: TimerWorker_1.SET_TIMEOUT,
                timeMs: 1000 / 30
            });
        };
        return this._outputCanvasElement.captureStream(parseInt(frameRate, 10));
    }
    /**
     * Stops the capture and render loop.
     *
     * @returns {void}
     */
    stopEffect() {
        this._maskFrameTimerWorker.postMessage({
            id: TimerWorker_1.CLEAR_TIMEOUT
        });
        this._maskFrameTimerWorker.terminate();
    }
}
exports.default = JitsiStreamBackgroundEffect;
