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
// @ts-expect-error
const Filmstrip_1 = __importDefault(require("../../../../../modules/UI/videolayout/Filmstrip"));
const functions_1 = require("../../../base/participants/functions");
const functions_web_1 = require("../../../filmstrip/functions.web");
const functions_web_2 = require("../../../toolbox/functions.web");
const VideoManager_1 = __importDefault(require("./VideoManager"));
const YoutubeVideoManager_1 = __importDefault(require("./YoutubeVideoManager"));
/** .
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * The conference participant who is on the local stage) on Web/React.
 *
 * @augments Component
 */
class SharedVideo extends react_1.Component {
    /**
     * Computes the width and the height of the component.
     *
     * @returns {{
     *  height: number,
     *  width: number
     * }}
     */
    getDimensions() {
        const { clientHeight, clientWidth, filmstripVisible, filmstripWidth } = this.props;
        let width;
        let height;
        if (interfaceConfig.VERTICAL_FILMSTRIP) {
            if (filmstripVisible) {
                width = `${clientWidth - filmstripWidth}px`;
            }
            else {
                width = `${clientWidth}px`;
            }
            height = `${clientHeight - (0, functions_web_2.getToolboxHeight)()}px`;
        }
        else {
            if (filmstripVisible) {
                height = `${clientHeight - Filmstrip_1.default.getFilmstripHeight()}px`;
            }
            else {
                height = `${clientHeight}px`;
            }
            width = `${clientWidth}px`;
        }
        return {
            width,
            height
        };
    }
    /**
     * Retrieves the manager to be used for playing the shared video.
     *
     * @returns {Component}
     */
    getManager() {
        const { videoUrl } = this.props;
        if (!videoUrl) {
            return null;
        }
        if (videoUrl.match(/http/)) {
            return react_1.default.createElement(VideoManager_1.default, { videoId: videoUrl });
        }
        return react_1.default.createElement(YoutubeVideoManager_1.default, { videoId: videoUrl });
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Element}
     */
    render() {
        const { isOwner, isResizing } = this.props;
        const className = !isResizing && isOwner ? '' : 'disable-pointer';
        return (react_1.default.createElement("div", { className: className, id: 'sharedVideo', style: this.getDimensions() }, this.getManager()));
    }
}
/**
 * Maps (parts of) the Redux state to the associated LargeVideo props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { ownerId, videoUrl } = state['features/shared-video'];
    const { clientHeight, clientWidth } = state['features/base/responsive-ui'];
    const { visible, isResizing } = state['features/filmstrip'];
    const localParticipant = (0, functions_1.getLocalParticipant)(state);
    return {
        clientHeight,
        clientWidth,
        filmstripVisible: visible,
        filmstripWidth: (0, functions_web_1.getVerticalViewMaxWidth)(state),
        isOwner: ownerId === localParticipant?.id,
        isResizing,
        videoUrl
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(SharedVideo);
