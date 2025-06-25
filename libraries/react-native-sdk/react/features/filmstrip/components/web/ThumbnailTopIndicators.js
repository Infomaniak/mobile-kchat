"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const utils_1 = require("../../../base/environment/utils");
const functions_1 = require("../../../base/participants/functions");
const ConnectionIndicator_1 = __importDefault(require("../../../connection-indicator/components/web/ConnectionIndicator"));
const constants_1 = require("../../constants");
const functions_web_1 = require("../../functions.web");
const PinnedIndicator_1 = __importDefault(require("./PinnedIndicator"));
const RaisedHandIndicator_1 = __importDefault(require("./RaisedHandIndicator"));
const StatusIndicators_1 = __importDefault(require("./StatusIndicators"));
const VideoMenuTriggerButton_1 = __importDefault(require("./VideoMenuTriggerButton"));
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        container: {
            display: 'flex',
            '& > *:not(:last-child)': {
                marginRight: '4px'
            }
        }
    };
});
const ThumbnailTopIndicators = ({ disableConnectionIndicator, hidePopover, indicatorsClassName, isHovered, local, participantId, popoverVisible, showPopover, thumbnailType }) => {
    const { classes: styles, cx } = useStyles();
    const _isMobile = (0, utils_1.isMobileBrowser)();
    const { NORMAL = 16 } = interfaceConfig.INDICATOR_FONT_SIZES || {};
    const _indicatorIconSize = NORMAL;
    const _connectionIndicatorAutoHideEnabled = Boolean((0, react_redux_1.useSelector)((state) => state['features/base/config'].connectionIndicators?.autoHide) ?? true);
    const _connectionIndicatorDisabled = _isMobile || disableConnectionIndicator
        || Boolean((0, react_redux_1.useSelector)((state) => state['features/base/config'].connectionIndicators?.disabled));
    const showConnectionIndicator = isHovered || !_connectionIndicatorAutoHideEnabled;
    const isVirtualScreenshareParticipant = (0, react_redux_1.useSelector)((state) => (0, functions_1.isScreenShareParticipantById)(state, participantId));
    if (isVirtualScreenshareParticipant) {
        return (react_1.default.createElement("div", { className: styles.container }, !_connectionIndicatorDisabled
            && react_1.default.createElement(ConnectionIndicator_1.default, { alwaysVisible: showConnectionIndicator, enableStatsDisplay: true, iconSize: _indicatorIconSize, participantId: participantId, statsPopoverPosition: constants_1.STATS_POPOVER_POSITION[thumbnailType] })));
    }
    const tooltipPosition = (0, functions_web_1.getIndicatorsTooltipPosition)(thumbnailType);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: styles.container },
            react_1.default.createElement(PinnedIndicator_1.default, { iconSize: _indicatorIconSize, participantId: participantId, tooltipPosition: tooltipPosition }),
            !_connectionIndicatorDisabled
                && react_1.default.createElement(ConnectionIndicator_1.default, { alwaysVisible: showConnectionIndicator, enableStatsDisplay: true, iconSize: _indicatorIconSize, participantId: participantId, statsPopoverPosition: constants_1.STATS_POPOVER_POSITION[thumbnailType] }),
            react_1.default.createElement(RaisedHandIndicator_1.default, { iconSize: _indicatorIconSize, participantId: participantId, tooltipPosition: tooltipPosition }),
            thumbnailType !== constants_1.THUMBNAIL_TYPE.TILE && (react_1.default.createElement("div", { className: cx(indicatorsClassName, 'top-indicators') },
                react_1.default.createElement(StatusIndicators_1.default, { participantID: participantId, screenshare: false })))),
        react_1.default.createElement("div", { className: styles.container },
            react_1.default.createElement(VideoMenuTriggerButton_1.default, { hidePopover: hidePopover, local: local, participantId: participantId, popoverVisible: popoverVisible, showPopover: showPopover, thumbnailType: thumbnailType, visible: isHovered }))));
};
exports.default = ThumbnailTopIndicators;
