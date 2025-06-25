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
const functions_1 = require("../../../base/i18n/functions");
const functions_2 = require("../../../base/media/functions");
const PreMeetingScreen_1 = __importDefault(require("../../../base/premeeting/components/web/PreMeetingScreen"));
const functions_web_1 = require("../../../base/tracks/functions.web");
const functions_3 = require("../../functions");
/**
 * This component is displayed before joining a meeting.
 */
class PrejoinThirdParty extends react_1.Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { className, deviceStatusVisible, showCameraPreview, videoTrack } = this.props;
        return (react_1.default.createElement(PreMeetingScreen_1.default, { className: `prejoin-third-party ${className}`, showDeviceStatus: deviceStatusVisible, skipPrejoinButton: false, thirdParty: true, videoMuted: !showCameraPreview, videoTrack: videoTrack }));
    }
}
/**
 * Maps (parts of) the redux state to the React {@code Component} props.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The props passed to the component.
 * @returns {Object}
 */
function mapStateToProps(state) {
    return {
        deviceStatusVisible: (0, functions_3.isDeviceStatusVisible)(state),
        showCameraPreview: !(0, functions_2.isVideoMutedByUser)(state),
        videoTrack: (0, functions_web_1.getLocalJitsiVideoTrack)(state)
    };
}
exports.default = (0, react_redux_1.connect)(mapStateToProps)((0, functions_1.translate)(PrejoinThirdParty));
