export interface IBackgroundEffectOptions {
    height: number;
    virtualBackground: {
        backgroundType?: string;
        blurValue?: number;
        virtualSource?: string;
    };
    width: number;
}
/**
 * Represents a modified MediaStream that adds effects to video background.
 * <tt>JitsiStreamBackgroundEffect</tt> does the processing of the original
 * video stream.
 */
export default class JitsiStreamBackgroundEffect {
    _model: any;
    _options: IBackgroundEffectOptions;
    _stream: any;
    _segmentationPixelCount: number;
    _inputVideoElement: HTMLVideoElement;
    _maskFrameTimerWorker: Worker;
    _outputCanvasElement: HTMLCanvasElement;
    _outputCanvasCtx: CanvasRenderingContext2D | null;
    _segmentationMaskCtx: CanvasRenderingContext2D | null;
    _segmentationMask: ImageData;
    _segmentationMaskCanvas: HTMLCanvasElement;
    _virtualImage: HTMLImageElement;
    _virtualVideo: HTMLVideoElement;
    /**
     * Represents a modified video MediaStream track.
     *
     * @class
     * @param {Object} model - Meet model.
     * @param {Object} options - Segmentation dimensions.
     */
    constructor(model: Object, options: IBackgroundEffectOptions);
    /**
     * EventHandler onmessage for the maskFrameTimerWorker WebWorker.
     *
     * @private
     * @param {EventHandler} response - The onmessage EventHandler parameter.
     * @returns {void}
     */
    _onMaskFrameTimer(response: {
        data: {
            id: number;
        };
    }): void;
    /**
     * Represents the run post processing.
     *
     * @returns {void}
     */
    runPostProcessing(): void;
    /**
     * Represents the run Tensorflow Interference.
     *
     * @returns {void}
     */
    runInference(): void;
    /**
     * Loop function to render the background mask.
     *
     * @private
     * @returns {void}
     */
    _renderMask(): void;
    /**
     * Represents the resize source process.
     *
     * @returns {void}
     */
    resizeSource(): void;
    /**
     * Checks if the local track supports this effect.
     *
     * @param {JitsiLocalTrack} jitsiLocalTrack - Track to apply effect.
     * @returns {boolean} - Returns true if this effect can run on the specified track
     * false otherwise.
     */
    isEnabled(jitsiLocalTrack: any): any;
    /**
     * Starts loop to capture video frame and render the segmentation mask.
     *
     * @param {MediaStream} stream - Stream to be used for processing.
     * @returns {MediaStream} - The stream with the applied effect.
     */
    startEffect(stream: MediaStream): MediaStream;
    /**
     * Stops the capture and render loop.
     *
     * @returns {void}
     */
    stopEffect(): void;
}
