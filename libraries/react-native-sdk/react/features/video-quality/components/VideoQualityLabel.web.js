"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../base/dialog/actions");
const svg_1 = require("../../base/icons/svg");
const Label_1 = __importDefault(require("../../base/label/components/web/Label"));
const constants_1 = require("../../base/label/constants");
const Tooltip_1 = __importDefault(require("../../base/tooltip/components/Tooltip"));
const functions_web_1 = require("../../video-layout/functions.web");
const VideoQualityDialog_web_1 = __importDefault(require("./VideoQualityDialog.web"));
/**
 * React {@code Component} responsible for displaying a label that indicates
 * the displayed video state of the current conference. {@code AudioOnlyLabel}
 * Will display when the conference is in audio only mode. {@code HDVideoLabel}
 * Will display if not in audio only mode and a high-definition large video is
 * being displayed.
 *
 * @returns {JSX}
 */
const VideoQualityLabel = () => {
    const _audioOnly = (0, react_redux_1.useSelector)((state) => state['features/base/audio-only'].enabled);
    const _visible = (0, react_redux_1.useSelector)((state) => !((0, functions_web_1.shouldDisplayTileView)(state)
        || interfaceConfig.VIDEO_QUALITY_LABEL_DISABLED));
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    if (!_visible) {
        return null;
    }
    let className, icon, labelContent, tooltipKey;
    if (_audioOnly) {
        className = 'audio-only';
        labelContent = t('videoStatus.audioOnly');
        tooltipKey = 'videoStatus.labelTooltipAudioOnly';
    }
    else {
        className = 'current-video-quality';
        icon = svg_1.IconPerformance;
        tooltipKey = 'videoStatus.performanceSettings';
    }
    const onClick = () => dispatch((0, actions_1.openDialog)(VideoQualityDialog_web_1.default));
    return (react_1.default.createElement(Tooltip_1.default, { content: t(tooltipKey), position: 'bottom' },
        react_1.default.createElement(Label_1.default, { accessibilityText: t(tooltipKey), className: className, color: constants_1.COLORS.white, icon: icon, iconColor: '#fff', id: 'videoResolutionLabel', 
            // eslint-disable-next-line react/jsx-no-bind
            onClick: onClick, text: labelContent })));
};
exports.default = VideoQualityLabel;
