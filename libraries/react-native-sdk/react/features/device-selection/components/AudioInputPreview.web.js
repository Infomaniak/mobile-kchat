"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const mui_1 = require("tss-react/mui");
const __web_1 = __importDefault(require("../../base/lib-jitsi-meet/_.web"));
const JitsiTrackEvents = __web_1.default.events.track;
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            display: 'flex'
        },
        section: {
            flex: 1,
            height: '4px',
            borderRadius: '1px',
            backgroundColor: theme.palette.ui04,
            marginRight: theme.spacing(1),
            '&:last-of-type': {
                marginRight: 0
            }
        },
        activeSection: {
            backgroundColor: theme.palette.success01
        }
    };
});
const NO_OF_PREVIEW_SECTIONS = 11;
const AudioInputPreview = (props) => {
    const [audioLevel, setAudioLevel] = (0, react_1.useState)(0);
    const { classes, cx } = useStyles();
    /**
     * Starts listening for audio level updates from the library.
     *
     * @param {JitsiLocalTrack} track - The track to listen to for audio level
     * updates.
     * @private
     * @returns {void}
     */
    function _listenForAudioUpdates(track) {
        _stopListeningForAudioUpdates();
        track?.on(JitsiTrackEvents.TRACK_AUDIO_LEVEL_CHANGED, setAudioLevel);
    }
    /**
     * Stops listening to further updates from the current track.
     *
     * @private
     * @returns {void}
     */
    function _stopListeningForAudioUpdates() {
        props.track?.off(JitsiTrackEvents.TRACK_AUDIO_LEVEL_CHANGED, setAudioLevel);
    }
    (0, react_1.useEffect)(() => {
        _listenForAudioUpdates(props.track);
        return _stopListeningForAudioUpdates;
    }, []);
    (0, react_1.useEffect)(() => {
        _listenForAudioUpdates(props.track);
        setAudioLevel(0);
    }, [props.track]);
    const audioMeterFill = Math.ceil(Math.floor(audioLevel * 100) / (100 / NO_OF_PREVIEW_SECTIONS));
    return (react_1.default.createElement("div", { className: classes.container }, new Array(NO_OF_PREVIEW_SECTIONS).fill(0)
        .map((_, idx) => (react_1.default.createElement("div", { className: cx(classes.section, idx < audioMeterFill && classes.activeSection), key: idx })))));
};
exports.default = AudioInputPreview;
