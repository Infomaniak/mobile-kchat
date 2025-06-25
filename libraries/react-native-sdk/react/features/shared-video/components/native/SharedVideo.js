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
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/participants/functions");
const constants_1 = require("../../../base/responsive-ui/constants");
const actions_1 = require("../../../toolbox/actions");
const VideoManager_1 = __importDefault(require("./VideoManager"));
const YoutubeVideoManager_1 = __importDefault(require("./YoutubeVideoManager"));
const styles_1 = __importDefault(require("./styles"));
/** .
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * The conference participant who is on the local stage) on Web/React.
 *
 * @augments Component
 */
class SharedVideo extends react_1.Component {
    /**
     * Initializes a new {@code SharedVideo} instance.
     *
     * @param {Object} props - The properties.
     */
    constructor(props) {
        super(props);
        this.setWideScreenMode(props.isWideScreen);
    }
    /**
     * Implements React's {@link Component#componentDidUpdate()}.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        const { isWideScreen } = this.props;
        if (isWideScreen !== prevProps.isWideScreen) {
            this.setWideScreenMode(isWideScreen);
        }
    }
    /**
     * Dispatches action to set the visibility of the toolbox, true if not widescreen, false otherwise.
     *
     * @param {isWideScreen} isWideScreen - Whether the screen is wide.
     * @private
     * @returns {void}
    */
    setWideScreenMode(isWideScreen) {
        this.props.dispatch((0, actions_1.setToolboxVisible)(!isWideScreen));
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Element}
     */
    render() {
        const { isOwner, playerHeight, playerWidth, videoUrl } = this.props;
        if (!videoUrl) {
            return null;
        }
        return (<react_native_1.View pointerEvents={isOwner ? 'auto' : 'none'} style={styles_1.default.videoContainer}>
                {videoUrl.match(/http/)
                ? (<VideoManager_1.default height={playerHeight} videoId={videoUrl} width={playerWidth}/>) : (<YoutubeVideoManager_1.default height={playerHeight} videoId={videoUrl} width={playerWidth}/>)}
            </react_native_1.View>);
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
    const { aspectRatio, clientHeight, clientWidth } = state['features/base/responsive-ui'];
    const isWideScreen = aspectRatio === constants_1.ASPECT_RATIO_WIDE;
    const localParticipant = (0, functions_1.getLocalParticipant)(state);
    let playerHeight, playerWidth;
    if (isWideScreen) {
        playerHeight = clientHeight;
        playerWidth = playerHeight * 16 / 9;
    }
    else {
        playerWidth = clientWidth;
        playerHeight = playerWidth * 9 / 16;
    }
    return {
        isOwner: ownerId === localParticipant?.id,
        isWideScreen,
        playerHeight,
        playerWidth,
        videoUrl
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(SharedVideo);
