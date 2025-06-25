"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const uuid_1 = require("uuid");
const webm_duration_fix_1 = __importDefault(require("webm-duration-fix"));
const functions_1 = require("../../../base/conference/functions");
const constants_1 = require("../../../base/media/constants");
const functions_2 = require("../../../base/tracks/functions");
const iframeUtils_1 = require("../../../base/util/iframeUtils");
const actions_any_1 = require("../../actions.any");
const getMimeType = () => {
    const possibleTypes = [
        'video/webm;codecs=vp8'
    ];
    for (const type of possibleTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
            return type;
        }
    }
    throw new Error('No MIME Type supported by MediaRecorder');
};
const VIDEO_BIT_RATE = 2500000; // 2.5Mbps in bits
const MAX_SIZE = 1073741824; // 1GB in bytes
// Lazily initialize.
let preferredMediaType;
const LocalRecordingManager = {
    recordingData: [],
    recorder: undefined,
    stream: undefined,
    audioContext: undefined,
    audioDestination: undefined,
    roomName: '',
    totalSize: MAX_SIZE,
    selfRecording: {
        on: false,
        withVideo: false
    },
    get mediaType() {
        if (this.selfRecording.on && !this.selfRecording.withVideo) {
            return 'audio/webm;';
        }
        if (!preferredMediaType) {
            preferredMediaType = getMimeType();
        }
        return preferredMediaType;
    },
    /**
     * Initializes audio context used for mixing audio tracks.
     *
     * @returns {void}
     */
    initializeAudioMixer() {
        this.audioContext = new AudioContext();
        this.audioDestination = this.audioContext.createMediaStreamDestination();
    },
    /**
     * Mixes multiple audio tracks to the destination media stream.
     *
     * @param {MediaStream} stream - The stream to mix.
     * @returns {void}
     * */
    mixAudioStream(stream) {
        if (stream.getAudioTracks().length > 0 && this.audioDestination) {
            this.audioContext?.createMediaStreamSource(stream).connect(this.audioDestination);
        }
    },
    /**
     * Adds audio track to the recording stream.
     *
     * @param {MediaStreamTrack} track - The track to be added.
     * @returns {void}
     */
    addAudioTrackToLocalRecording(track) {
        if (this.selfRecording.on) {
            return;
        }
        if (track) {
            const stream = new MediaStream([track]);
            this.mixAudioStream(stream);
        }
    },
    /**
     * Returns a filename based ono the Jitsi room name in the URL and timestamp.
     *
     * @returns {string}
     * */
    getFilename() {
        const now = new Date();
        const timestamp = now.toISOString();
        return `${this.roomName}_${timestamp}`;
    },
    /**
     * Saves local recording to file.
     *
     * @param {Array} recordingData - The recording data.
     * @param {string} filename - The name of the file.
     * @returns {void}
     * */
    async saveRecording(recordingData, filename) {
        // @ts-ignore
        const blob = await (0, webm_duration_fix_1.default)(new Blob(recordingData, { type: this.mediaType }));
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const extension = this.mediaType.slice(this.mediaType.indexOf('/') + 1, this.mediaType.indexOf(';'));
        a.style.display = 'none';
        a.href = url;
        a.download = `${filename}.${extension}`;
        a.click();
    },
    /**
     * Stops local recording.
     *
     * @returns {void}
     * */
    stopLocalRecording() {
        if (this.recorder) {
            this.recorder.stop();
            this.recorder = undefined;
            this.audioContext = undefined;
            this.audioDestination = undefined;
            this.totalSize = MAX_SIZE;
            setTimeout(() => {
                if (this.recordingData.length > 0) {
                    this.saveRecording(this.recordingData, this.getFilename());
                }
            }, 1000);
        }
    },
    /**
     * Starts a local recording.
     *
     * @param {IStore} store - The redux store.
     * @param {boolean} onlySelf - Whether to record only self streams.
     * @returns {void}
     */
    async startLocalRecording(store, onlySelf) {
        const { dispatch, getState } = store;
        // @ts-ignore
        const supportsCaptureHandle = Boolean(navigator.mediaDevices.setCaptureHandleConfig) && !(0, iframeUtils_1.inIframe)();
        const tabId = (0, uuid_1.v4)();
        this.selfRecording.on = onlySelf;
        this.recordingData = [];
        this.roomName = (0, functions_1.getRoomName)(getState()) ?? '';
        let gdmStream = new MediaStream();
        const tracks = (0, functions_2.getTrackState)(getState());
        if (onlySelf) {
            let audioTrack = (0, functions_2.getLocalTrack)(tracks, constants_1.MEDIA_TYPE.AUDIO)?.jitsiTrack?.track;
            let videoTrack = (0, functions_2.getLocalTrack)(tracks, constants_1.MEDIA_TYPE.VIDEO)?.jitsiTrack?.track;
            if (!audioTrack) {
                APP.conference.muteAudio(false);
                setTimeout(() => APP.conference.muteAudio(true), 100);
                await new Promise(resolve => {
                    setTimeout(resolve, 100);
                });
            }
            if (videoTrack && videoTrack.readyState !== 'live') {
                videoTrack = undefined;
            }
            audioTrack = (0, functions_2.getLocalTrack)((0, functions_2.getTrackState)(getState()), constants_1.MEDIA_TYPE.AUDIO)?.jitsiTrack?.track;
            if (!audioTrack && !videoTrack) {
                throw new Error('NoLocalStreams');
            }
            this.selfRecording.withVideo = Boolean(videoTrack);
            const localTracks = [];
            audioTrack && localTracks.push(audioTrack);
            videoTrack && localTracks.push(videoTrack);
            this.stream = new MediaStream(localTracks);
        }
        else {
            if (supportsCaptureHandle) {
                // @ts-ignore
                navigator.mediaDevices.setCaptureHandleConfig({
                    handle: `JitsiMeet-${tabId}`,
                    permittedOrigins: ['*']
                });
            }
            const localAudioTrack = (0, functions_2.getLocalTrack)(tracks, constants_1.MEDIA_TYPE.AUDIO)?.jitsiTrack?.track;
            // Starting chrome 107, the recorder does not record any data if the audio stream has no tracks
            // To fix this we create a track for the local user(muted track)
            if (!localAudioTrack) {
                APP.conference.muteAudio(false);
                setTimeout(() => APP.conference.muteAudio(true), 100);
                await new Promise(resolve => {
                    setTimeout(resolve, 100);
                });
            }
            // handle no mic permission
            if (!(0, functions_2.getLocalTrack)((0, functions_2.getTrackState)(getState()), constants_1.MEDIA_TYPE.AUDIO)?.jitsiTrack?.track) {
                throw new Error('NoMicTrack');
            }
            const currentTitle = document.title;
            document.title = i18next_1.default.t('localRecording.selectTabTitle');
            // @ts-ignore
            gdmStream = await navigator.mediaDevices.getDisplayMedia({
                video: { displaySurface: 'browser',
                    frameRate: 30 },
                audio: false,
                preferCurrentTab: true
            });
            document.title = currentTitle;
            const isBrowser = gdmStream.getVideoTracks()[0].getSettings().displaySurface === 'browser';
            if (!isBrowser || (supportsCaptureHandle // @ts-ignore
                && gdmStream.getVideoTracks()[0].getCaptureHandle()?.handle !== `JitsiMeet-${tabId}`)) {
                gdmStream.getTracks().forEach((track) => track.stop());
                throw new Error('WrongSurfaceSelected');
            }
            this.initializeAudioMixer();
            const allTracks = (0, functions_2.getTrackState)(getState());
            allTracks.forEach((track) => {
                if (track.mediaType === constants_1.MEDIA_TYPE.AUDIO) {
                    const audioTrack = track?.jitsiTrack?.track;
                    this.addAudioTrackToLocalRecording(audioTrack);
                }
            });
            this.stream = new MediaStream([
                ...this.audioDestination?.stream.getAudioTracks() || [],
                gdmStream.getVideoTracks()[0]
            ]);
        }
        this.recorder = new MediaRecorder(this.stream, {
            mimeType: this.mediaType,
            videoBitsPerSecond: VIDEO_BIT_RATE
        });
        this.recorder.addEventListener('dataavailable', e => {
            if (e.data && e.data.size > 0) {
                this.recordingData.push(e.data);
                this.totalSize -= e.data.size;
                if (this.totalSize <= 0) {
                    dispatch((0, actions_any_1.stopLocalVideoRecording)());
                }
            }
        });
        if (!onlySelf) {
            this.recorder.addEventListener('stop', () => {
                this.stream?.getTracks().forEach((track) => track.stop());
                gdmStream?.getTracks().forEach((track) => track.stop());
            });
            gdmStream?.addEventListener('inactive', () => {
                dispatch((0, actions_any_1.stopLocalVideoRecording)());
            });
            this.stream.addEventListener('inactive', () => {
                dispatch((0, actions_any_1.stopLocalVideoRecording)());
            });
        }
        this.recorder.start(5000);
    },
    /**
     * Whether or not we're currently recording locally.
     *
     * @returns {boolean}
     */
    isRecordingLocally() {
        return Boolean(this.recorder);
    }
};
exports.default = LocalRecordingManager;
