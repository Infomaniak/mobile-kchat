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
exports.ConnectionIndicatorIcon = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const actions_web_1 = require("../../../base/tracks/actions.web");
const ConnectionIndicatorIcon = ({ classes, colorClass, connectionIndicatorInactiveDisabled, isConnectionStatusInactive, isConnectionStatusInterrupted, track }) => {
    const { cx } = (0, mui_1.useStyles)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const sourceName = track?.jitsiTrack?.getSourceName();
    const handleTrackStreamingStatusChanged = (jitsiTrack, streamingStatus) => {
        dispatch((0, actions_web_1.trackStreamingStatusChanged)(jitsiTrack, streamingStatus));
    };
    // TODO: replace this with a custom hook to be reused where track streaming status is needed.
    // TODO: In the hood the listener should updates a local track streaming status instead of that in redux store.
    (0, react_1.useEffect)(() => {
        if (track && !track.local) {
            track.jitsiTrack.on(lib_jitsi_meet_1.JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED, handleTrackStreamingStatusChanged);
            dispatch((0, actions_web_1.trackStreamingStatusChanged)(track.jitsiTrack, track.jitsiTrack.getTrackStreamingStatus?.()));
        }
        return () => {
            if (track && !track.local) {
                track.jitsiTrack.off(lib_jitsi_meet_1.JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED, handleTrackStreamingStatusChanged);
                dispatch((0, actions_web_1.trackStreamingStatusChanged)(track.jitsiTrack, track.jitsiTrack.getTrackStreamingStatus?.()));
            }
        };
    }, [sourceName]);
    if (isConnectionStatusInactive) {
        if (connectionIndicatorInactiveDisabled) {
            return null;
        }
        return (react_1.default.createElement("span", { className: 'connection_ninja' },
            react_1.default.createElement(Icon_1.default, { className: cx(classes?.icon, classes?.inactiveIcon, colorClass), size: 24, src: svg_1.IconConnectionInactive })));
    }
    let emptyIconWrapperClassName = 'connection_empty';
    if (isConnectionStatusInterrupted) {
        // emptyIconWrapperClassName is used by the torture tests to identify lost connection status handling.
        emptyIconWrapperClassName = 'connection_lost';
    }
    return (react_1.default.createElement("span", { className: emptyIconWrapperClassName },
        react_1.default.createElement(Icon_1.default, { className: cx(classes?.icon, colorClass), size: 16, src: svg_1.IconConnection })));
};
exports.ConnectionIndicatorIcon = ConnectionIndicatorIcon;
