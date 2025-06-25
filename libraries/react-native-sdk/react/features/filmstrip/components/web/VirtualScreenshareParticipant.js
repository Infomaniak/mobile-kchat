"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const VideoTrack_1 = __importDefault(require("../../../base/media/components/web/VideoTrack"));
const constants_1 = require("../../../video-layout/constants");
const functions_web_1 = require("../../../video-layout/functions.web");
const ThumbnailBottomIndicators_1 = __importDefault(require("./ThumbnailBottomIndicators"));
const ThumbnailTopIndicators_1 = __importDefault(require("./ThumbnailTopIndicators"));
const VirtualScreenshareParticipant = ({ classes, containerClassName, isHovered, isLocal, isMobile, onClick, onMouseEnter, onMouseLeave, onMouseMove, onTouchEnd, onTouchMove, onTouchStart, participantId, shouldDisplayTintBackground, styles, videoTrack, thumbnailType }) => {
    const currentLayout = (0, react_redux_1.useSelector)(functions_web_1.getCurrentLayout);
    const videoTrackId = videoTrack?.jitsiTrack?.getId();
    const video = videoTrack && react_1.default.createElement(VideoTrack_1.default, { id: isLocal ? 'localScreenshare_container' : `remoteVideo_${videoTrackId || ''}`, muted: true, style: styles.video, videoTrack: videoTrack });
    const { cx } = (0, mui_1.useStyles)();
    return (react_1.default.createElement("span", { className: containerClassName, id: `participant_${participantId}`, ...(isMobile
            ? {
                onTouchEnd,
                onTouchMove,
                onTouchStart
            }
            : {
                onClick,
                onMouseEnter,
                onMouseMove,
                onMouseLeave
            }), style: styles.thumbnail },
        video,
        react_1.default.createElement("div", { className: classes?.containerBackground }),
        react_1.default.createElement("div", { className: cx(classes?.indicatorsContainer, classes?.indicatorsTopContainer, currentLayout === constants_1.LAYOUTS.TILE_VIEW && 'tile-view-mode') },
            react_1.default.createElement(ThumbnailTopIndicators_1.default, { isHovered: isHovered, participantId: participantId, thumbnailType: thumbnailType })),
        shouldDisplayTintBackground && react_1.default.createElement("div", { className: classes?.tintBackground }),
        react_1.default.createElement("div", { className: cx(classes?.indicatorsContainer, classes?.indicatorsBottomContainer, currentLayout === constants_1.LAYOUTS.TILE_VIEW && 'tile-view-mode') },
            react_1.default.createElement(ThumbnailBottomIndicators_1.default, { className: classes?.indicatorsBackground, local: false, participantId: participantId, showStatusIndicators: true }))));
};
exports.default = VirtualScreenshareParticipant;
