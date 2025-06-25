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
const clsx_1 = __importDefault(require("clsx"));
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_1 = require("../../base/audio-only/actions");
const functions_2 = require("../../base/i18n/functions");
const actions_2 = require("../../base/lastn/actions");
const functions_3 = require("../../base/lastn/functions");
const functions_web_1 = require("../../base/styles/functions.web");
const actions_3 = require("../actions");
const constants_1 = require("../constants");
const logger_1 = __importDefault(require("../logger"));
const Slider_web_1 = __importDefault(require("./Slider.web"));
const { ULTRA, HIGH, STANDARD, LOW } = constants_1.VIDEO_QUALITY_LEVELS;
/**
 * Creates an analytics event for a press of one of the buttons in the video
 * quality dialog.
 *
 * @param {string} quality - The quality which was selected.
 * @returns {Object} The event in a format suitable for sending via
 *      sendAnalytics.
 */
const createEvent = function (quality) {
    return (0, AnalyticsEvents_1.createToolbarEvent)('video.quality', {
        quality
    });
};
/**
 * Creates the styles for the component.
 *
 * @param {Object} theme - The current UI theme.
 *
 * @returns {Object}
 */
const styles = (theme) => {
    return {
        dialog: {
            color: theme.palette.text01
        },
        dialogDetails: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegularLarge),
            marginBottom: 16
        },
        dialogContents: {
            background: theme.palette.ui01,
            padding: '16px 16px 48px 16px'
        },
        sliderDescription: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.heading6),
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 40
        }
    };
};
/**
 * Implements a React {@link Component} which displays a slider for selecting a
 * new receive video quality.
 *
 * @augments Component
 */
class VideoQualitySlider extends react_1.Component {
    /**
     * Initializes a new {@code VideoQualitySlider} instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once for every instance.
        this._enableAudioOnly = this._enableAudioOnly.bind(this);
        this._enableHighDefinition = this._enableHighDefinition.bind(this);
        this._enableLowDefinition = this._enableLowDefinition.bind(this);
        this._enableStandardDefinition
            = this._enableStandardDefinition.bind(this);
        this._enableUltraHighDefinition = this._enableUltraHighDefinition.bind(this);
        this._onSliderChange = this._onSliderChange.bind(this);
        /**
         * An array of configuration options for displaying a choice in the
         * input. The onSelect callback will be invoked when the option is
         * selected and videoQuality helps determine which choice matches with
         * the currently active quality level.
         *
         * @private
         * @type {Object[]}
         */
        this._sliderOptions = [
            {
                audioOnly: true,
                onSelect: this._enableAudioOnly,
                textKey: 'audioOnly.audioOnly'
            },
            {
                onSelect: this._enableLowDefinition,
                textKey: 'videoStatus.lowDefinition',
                videoQuality: LOW
            },
            {
                onSelect: this._enableStandardDefinition,
                textKey: 'videoStatus.standardDefinition',
                videoQuality: STANDARD
            },
            {
                onSelect: this._enableUltraHighDefinition,
                textKey: 'videoStatus.highDefinition',
                videoQuality: ULTRA
            }
        ];
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        const activeSliderOption = this._mapCurrentQualityToSliderValue();
        return (react_1.default.createElement("div", { className: (0, clsx_1.default)('video-quality-dialog', classes.dialog) },
            react_1.default.createElement("div", { "aria-hidden": true, className: classes.dialogDetails }, t('videoStatus.adjustFor')),
            react_1.default.createElement("div", { className: classes.dialogContents },
                react_1.default.createElement("div", { "aria-hidden": true, className: classes.sliderDescription },
                    react_1.default.createElement("span", null, t('videoStatus.bestPerformance')),
                    react_1.default.createElement("span", null, t('videoStatus.highestQuality'))),
                react_1.default.createElement(Slider_web_1.default, { ariaLabel: t('videoStatus.callQuality'), max: this._sliderOptions.length - 1, min: 0, onChange: this._onSliderChange, step: 1, value: activeSliderOption }))));
    }
    /**
     * Dispatches an action to enable audio only mode.
     *
     * @private
     * @returns {void}
     */
    _enableAudioOnly() {
        (0, functions_1.sendAnalytics)(createEvent('audio.only'));
        logger_1.default.log('Video quality: audio only enabled');
        this.props.dispatch((0, actions_1.setAudioOnly)(true));
    }
    /**
     * Handles the action of the high definition video being selected.
     * Dispatches an action to receive high quality video from remote
     * participants.
     *
     * @private
     * @returns {void}
     */
    _enableHighDefinition() {
        (0, functions_1.sendAnalytics)(createEvent('high'));
        logger_1.default.log('Video quality: high enabled');
        this._setPreferredVideoQuality(HIGH);
    }
    /**
     * Dispatches an action to receive low quality video from remote
     * participants.
     *
     * @private
     * @returns {void}
     */
    _enableLowDefinition() {
        (0, functions_1.sendAnalytics)(createEvent('low'));
        logger_1.default.log('Video quality: low enabled');
        this._setPreferredVideoQuality(LOW);
    }
    /**
     * Dispatches an action to receive standard quality video from remote
     * participants.
     *
     * @private
     * @returns {void}
     */
    _enableStandardDefinition() {
        (0, functions_1.sendAnalytics)(createEvent('standard'));
        logger_1.default.log('Video quality: standard enabled');
        this._setPreferredVideoQuality(STANDARD);
    }
    /**
     * Dispatches an action to receive ultra HD quality video from remote
     * participants.
     *
     * @private
     * @returns {void}
     */
    _enableUltraHighDefinition() {
        (0, functions_1.sendAnalytics)(createEvent('ultra high'));
        logger_1.default.log('Video quality: ultra high enabled');
        this._setPreferredVideoQuality(ULTRA);
    }
    /**
     * Matches the current video quality state with corresponding index of the
     * component's slider options.
     *
     * @private
     * @returns {void}
     */
    _mapCurrentQualityToSliderValue() {
        const { _audioOnly, _sendrecvVideoQuality } = this.props;
        const { _sliderOptions } = this;
        if (_audioOnly) {
            const audioOnlyOption = _sliderOptions.find(({ audioOnly }) => audioOnly);
            // @ts-ignore
            return _sliderOptions.indexOf(audioOnlyOption);
        }
        for (let i = 0; i < _sliderOptions.length; i++) {
            if (Number(_sliderOptions[i].videoQuality) >= _sendrecvVideoQuality) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Invokes a callback when the selected video quality changes.
     *
     * @param {Object} event - The slider's change event.
     * @private
     * @returns {void}
     */
    _onSliderChange(event) {
        const { _audioOnly, _sendrecvVideoQuality } = this.props;
        const { 
        // @ts-ignore
        audioOnly, 
        // @ts-ignore
        onSelect, 
        // @ts-ignore
        videoQuality } = this._sliderOptions[event.target.value];
        // Take no action if the newly chosen option does not change audio only
        // or video quality state.
        if ((_audioOnly && audioOnly)
            || (!_audioOnly && videoQuality === _sendrecvVideoQuality)) {
            return;
        }
        onSelect();
    }
    /**
     * Helper for changing the preferred maximum video quality to receive and
     * disable audio only.
     *
     * @param {number} qualityLevel - The new maximum video quality. Should be
     * a value enumerated in {@code VIDEO_QUALITY_LEVELS}.
     * @private
     * @returns {void}
     */
    _setPreferredVideoQuality(qualityLevel) {
        this.props.dispatch((0, actions_3.setPreferredVideoQuality)(qualityLevel));
        if (this.props._audioOnly) {
            this.props.dispatch((0, actions_1.setAudioOnly)(false));
        }
        // Determine the lastN value based on the quality setting.
        let { _channelLastN = constants_1.DEFAULT_LAST_N } = this.props;
        _channelLastN = _channelLastN === -1 ? constants_1.DEFAULT_LAST_N : _channelLastN;
        const lastN = (0, functions_3.getLastNForQualityLevel)(qualityLevel, _channelLastN);
        // Set the lastN for the conference.
        this.props.dispatch((0, actions_2.setLastN)(lastN));
    }
}
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code VideoQualitySlider} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { enabled: audioOnly } = state['features/base/audio-only'];
    const { p2p } = state['features/base/conference'];
    const { preferredVideoQuality } = state['features/video-quality'];
    const { channelLastN } = state['features/base/config'];
    return {
        _audioOnly: audioOnly,
        _channelLastN: channelLastN,
        _p2p: p2p,
        _sendrecvVideoQuality: preferredVideoQuality
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)((0, mui_1.withStyles)(VideoQualitySlider, styles)));
