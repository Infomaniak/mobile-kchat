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
const react_redux_1 = require("react-redux");
const Avatar_1 = __importDefault(require("../../../avatar/components/Avatar"));
const Video_1 = __importDefault(require("../../../media/components/web/Video"));
const functions_1 = require("../../../participants/functions");
const functions_web_1 = require("../../../settings/functions.web");
const functions_web_2 = require("../../../tracks/functions.web");
/**
 * Component showing the video preview and device status.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactElement}
 */
function Preview(props) {
    const { _participantId, flipVideo, name, videoMuted, videoTrack } = props;
    const className = flipVideo ? 'flipVideoX' : '';
    (0, react_1.useEffect)(() => {
        APP.API.notifyPrejoinVideoVisibilityChanged(Boolean(!videoMuted && videoTrack));
    }, [videoMuted, videoTrack]);
    (0, react_1.useEffect)(() => {
        APP.API.notifyPrejoinLoaded();
        return () => APP.API.notifyPrejoinVideoVisibilityChanged(false);
    }, []);
    return (react_1.default.createElement("div", { id: 'preview' }, !videoMuted && videoTrack
        ? (react_1.default.createElement(Video_1.default, { className: className, id: 'prejoinVideo', videoTrack: { jitsiTrack: videoTrack } }))
        : (react_1.default.createElement(Avatar_1.default, { className: 'premeeting-screen-avatar', displayName: name, participantId: _participantId, size: 200 }))));
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const name = (0, functions_web_1.getDisplayName)(state);
    const { id: _participantId } = (0, functions_1.getLocalParticipant)(state) ?? {};
    return {
        _participantId: _participantId ?? '',
        flipVideo: Boolean(state['features/base/settings'].localFlipX),
        name,
        videoMuted: ownProps.videoTrack ? ownProps.videoMuted : state['features/base/media'].video.muted,
        videoTrack: ownProps.videoTrack || (0, functions_web_2.getLocalVideoTrack)(state['features/base/tracks'])?.jitsiTrack
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(Preview);
