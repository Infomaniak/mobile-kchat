"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("image-capture");
require("./createImageBitmap");
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const functions_2 = require("../base/conference/functions");
const functions_3 = require("../base/participants/functions");
const helpers_1 = require("../base/util/helpers");
const functions_any_1 = require("../dynamic-branding/functions.any");
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
// eslint-disable-next-line lines-around-comment
// @ts-ignore
const processScreenshot_1 = require("./processScreenshot");
/**
 * Effect that wraps {@code MediaStream} adding periodic screenshot captures.
 * Manipulates the original desktop stream and performs custom processing operations, if implemented.
 */
class ScreenshotCaptureSummary {
    /**
     * Initializes a new {@code ScreenshotCaptureEffect} instance.
     *
     * @param {Object} state - The redux state.
     */
    constructor(state) {
        this._state = state;
        // Bind handlers such that they access the same instance.
        this._handleWorkerAction = this._handleWorkerAction.bind(this);
        const baseUrl = `${(0, helpers_1.getBaseUrl)()}libs/`;
        let workerUrl = `${baseUrl}screenshot-capture-worker.min.js`;
        // @ts-ignore
        const workerBlob = new Blob([`importScripts("${workerUrl}");`], { type: 'application/javascript' });
        // @ts-ignore
        workerUrl = window.URL.createObjectURL(workerBlob);
        this._streamWorker = new Worker(workerUrl, { name: 'Screenshot capture worker' });
        this._streamWorker.onmessage = this._handleWorkerAction;
        this._initializedRegion = false;
        this._queue = [];
    }
    /**
     * Make a call to backend for region selection.
     *
     * @returns {void}
     */
    async _initRegionSelection() {
        const { _screenshotHistoryRegionUrl } = this._state['features/base/config'];
        const conference = (0, functions_2.getCurrentConference)(this._state);
        const sessionId = conference?.getMeetingUniqueId();
        const { jwt } = this._state['features/base/jwt'];
        if (!_screenshotHistoryRegionUrl) {
            return;
        }
        const headers = {
            ...jwt && { 'Authorization': `Bearer ${jwt}` }
        };
        try {
            await fetch(`${_screenshotHistoryRegionUrl}/${sessionId}`, {
                method: 'POST',
                headers
            });
        }
        catch (err) {
            logger_1.default.warn(`Could not create screenshot region: ${err}`);
            return;
        }
        this._initializedRegion = true;
    }
    /**
     * Starts the screenshot capture event on a loop.
     *
     * @param {JitsiTrack} jitsiTrack - The track that contains the stream from which screenshots are to be sent.
     * @returns {Promise} - Promise that resolves once effect has started or rejects if the
     * videoType parameter is not desktop.
     */
    async start(jitsiTrack) {
        if (!window.OffscreenCanvas) {
            logger_1.default.warn('Can\'t start screenshot capture, OffscreenCanvas is not available');
            return;
        }
        const { videoType, track } = jitsiTrack;
        if (videoType !== 'desktop') {
            return;
        }
        this._imageCapture = new ImageCapture(track);
        if (!this._initializedRegion) {
            await this._initRegionSelection();
        }
        this.sendTimeout();
    }
    /**
     * Stops the ongoing {@code ScreenshotCaptureEffect} by clearing the {@code Worker} interval.
     *
     * @returns {void}
     */
    stop() {
        this._streamWorker.postMessage({ id: constants_1.CLEAR_TIMEOUT });
    }
    /**
     * Sends to worker the imageBitmap for the next timeout.
     *
     * @returns {Promise<void>}
     */
    async sendTimeout() {
        let imageBitmap;
        if (!this._imageCapture.track || this._imageCapture.track.readyState !== 'live') {
            logger_1.default.warn('Track is in invalid state');
            this.stop();
            return;
        }
        try {
            imageBitmap = await this._imageCapture.grabFrame();
        }
        catch (e) {
            // ignore error
        }
        this._streamWorker.postMessage({
            id: constants_1.SET_TIMEOUT,
            timeMs: constants_1.POLL_INTERVAL,
            imageBitmap
        });
    }
    /**
     * Handler of the {@code EventHandler} message that calls the appropriate method based on the parameter's id.
     *
     * @private
     * @param {EventHandler} message - Message received from the Worker.
     * @returns {void}
     */
    _handleWorkerAction(message) {
        const { id, imageBlob } = message.data;
        this.sendTimeout();
        if (id === constants_1.TIMEOUT_TICK && imageBlob && this._queue.length < constants_1.SCREENSHOT_QUEUE_LIMIT) {
            this._doProcessScreenshot(imageBlob);
        }
    }
    /**
     * Method that processes the screenshot.
     *
     * @private
     * @param {Blob} imageBlob - The blob for the current screenshot.
     * @returns {void}
     */
    _doProcessScreenshot(imageBlob) {
        this._queue.push(imageBlob);
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createScreensharingCaptureTakenEvent)());
        const conference = (0, functions_2.getCurrentConference)(this._state);
        const sessionId = conference?.getMeetingUniqueId();
        const { connection } = this._state['features/base/connection'];
        const jid = connection?.getJid();
        const timestamp = Date.now();
        const { jwt } = this._state['features/base/jwt'];
        const meetingFqn = (0, functions_any_1.extractFqnFromPath)();
        const remoteParticipants = (0, functions_3.getRemoteParticipants)(this._state);
        const participants = [];
        participants.push((0, functions_3.getLocalParticipant)(this._state)?.id);
        remoteParticipants.forEach(p => participants.push(p.id));
        (0, processScreenshot_1.processScreenshot)(imageBlob, {
            jid,
            jwt,
            sessionId,
            timestamp,
            meetingFqn,
            participants
        }).then(() => {
            const index = this._queue.indexOf(imageBlob);
            if (index > -1) {
                this._queue.splice(index, 1);
            }
        });
    }
}
exports.default = ScreenshotCaptureSummary;
