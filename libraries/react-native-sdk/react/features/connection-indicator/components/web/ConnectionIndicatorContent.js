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
exports._mapStateToProps = exports._mapDispatchToProps = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/dialog/actions");
const functions_1 = require("../../../base/i18n/functions");
const constants_1 = require("../../../base/media/constants");
const functions_2 = require("../../../base/participants/functions");
const functions_web_1 = require("../../../base/tracks/functions.web");
const ConnectionStatsTable_1 = __importDefault(require("../../../connection-stats/components/ConnectionStatsTable"));
const actions_web_1 = require("../../actions.web");
const functions_3 = require("../../functions");
const AbstractConnectionIndicator_1 = __importStar(require("../AbstractConnectionIndicator"));
const BandwidthSettingsDialog_1 = __importDefault(require("./BandwidthSettingsDialog"));
/**
 * An array of display configurations for the connection indicator and its bars.
 * The ordering is done specifically for faster iteration to find a matching
 * configuration to the current connection strength percentage.
 *
 * @type {Object[]}
 */
const QUALITY_TO_WIDTH = [
    // Full (3 bars)
    {
        colorClass: 'status-high',
        percent: AbstractConnectionIndicator_1.INDICATOR_DISPLAY_THRESHOLD,
        tip: 'connectionindicator.quality.good',
        width: '100%'
    },
    // 2 bars
    {
        colorClass: 'status-med',
        percent: 10,
        tip: 'connectionindicator.quality.nonoptimal',
        width: '66%'
    },
    // 1 bar
    {
        colorClass: 'status-low',
        percent: 0,
        tip: 'connectionindicator.quality.poor',
        width: '33%'
    }
    // Note: we never show 0 bars as long as there is a connection.
];
/**
 * Implements a React {@link Component} which displays the current connection
 * quality percentage and has a popover to show more detailed connection stats.
 *
 * @augments {Component}
 */
class ConnectionIndicatorContent extends AbstractConnectionIndicator_1.default {
    /**
     * Initializes a new {@code ConnectionIndicator} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            autoHideTimeout: undefined,
            showIndicator: false,
            showMoreStats: false,
            stats: props.inheritedStats || {}
        };
        // Bind event handlers so they are only bound once for every instance.
        this._onToggleShowMore = this._onToggleShowMore.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { bandwidth, bitrate, bridgeCount, codec, framerate, maxEnabledResolution, packetLoss, resolution, serverRegion, transport } = this.state.stats;
        return (react_1.default.createElement(ConnectionStatsTable_1.default, { audioSsrc: this.props._audioSsrc, bandwidth: bandwidth, bitrate: bitrate, bridgeCount: bridgeCount, codec: codec, connectionSummary: this._getConnectionStatusTip(), disableShowMoreStats: this.props._disableShowMoreStats, e2eeVerified: this.props._isE2EEVerified, enableAssumedBandwidth: this.props._enableAssumedBandwidth, enableSaveLogs: this.props._enableSaveLogs, framerate: framerate, isLocalVideo: this.props._isLocalVideo, isNarrowLayout: this.props._isNarrowLayout, isVirtualScreenshareParticipant: this.props._isVirtualScreenshareParticipant, maxEnabledResolution: maxEnabledResolution, onOpenBandwidthDialog: this.props._onOpenBandwidthDialog, onSaveLogs: this.props._onSaveLogs, onShowMore: this._onToggleShowMore, packetLoss: packetLoss, participantId: this.props.participantId, region: this.props._region ?? '', resolution: resolution, serverRegion: serverRegion, shouldShowMore: this.state.showMoreStats, transport: transport, videoSsrc: this.props._videoSsrc }));
    }
    /**
     * Returns a string that describes the current connection status.
     *
     * @private
     * @returns {string}
     */
    _getConnectionStatusTip() {
        let tipKey;
        const { _isConnectionStatusInactive, _isConnectionStatusInterrupted } = this.props;
        switch (true) {
            case _isConnectionStatusInterrupted:
                tipKey = 'connectionindicator.quality.lost';
                break;
            case _isConnectionStatusInactive:
                tipKey = 'connectionindicator.quality.inactive';
                break;
            default: {
                const { percent } = this.state.stats;
                if (typeof percent === 'undefined') {
                    // If percentage is undefined then there are no stats available
                    // yet, likely because only a local connection has been
                    // established so far. Assume a strong connection to start.
                    tipKey = 'connectionindicator.quality.good';
                }
                else {
                    const config = this._getDisplayConfiguration(percent);
                    tipKey = config.tip;
                }
            }
        }
        return this.props.t(tipKey);
    }
    /**
     * Get the icon configuration from QUALITY_TO_WIDTH which has a percentage
     * that matches or exceeds the passed in percentage. The implementation
     * assumes QUALITY_TO_WIDTH is already sorted by highest to lowest
     * percentage.
     *
     * @param {number} percent - The connection percentage, out of 100, to find
     * the closest matching configuration for.
     * @private
     * @returns {Object}
     */
    _getDisplayConfiguration(percent) {
        return QUALITY_TO_WIDTH.find(x => percent >= x.percent) || { tip: '' };
    }
    /**
     * Callback to invoke when the show more link in the popover content is
     * clicked. Sets the state which will determine if the popover should show
     * additional statistics about the connection.
     *
     * @returns {void}
     */
    _onToggleShowMore() {
        this.setState({ showMoreStats: !this.state.showMoreStats });
    }
}
/**
 * Maps redux actions to the props of the component.
 *
 * @param {Function} dispatch - The redux action {@code dispatch} function.
 * @returns {{
 *     _onSaveLogs: Function,
 * }}
 * @private
 */
function _mapDispatchToProps(dispatch) {
    return {
        /**
         * Saves the conference logs.
         *
         * @returns {Function}
         */
        _onSaveLogs() {
            dispatch((0, actions_web_1.saveLogs)());
        },
        /**
         * Opens the bandwidth settings dialog.
         *
         * @returns {void}
         */
        _onOpenBandwidthDialog() {
            dispatch((0, actions_1.openDialog)(BandwidthSettingsDialog_1.default));
        }
    };
}
exports._mapDispatchToProps = _mapDispatchToProps;
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const { participantId } = ownProps;
    const conference = state['features/base/conference'].conference;
    const participant = participantId ? (0, functions_2.getParticipantById)(state, participantId) : (0, functions_2.getLocalParticipant)(state);
    const { isNarrowLayout } = state['features/base/responsive-ui'];
    const tracks = state['features/base/tracks'];
    const audioTrack = (0, functions_web_1.getTrackByMediaTypeAndParticipant)(tracks, constants_1.MEDIA_TYPE.AUDIO, participantId);
    let videoTrack = (0, functions_web_1.getTrackByMediaTypeAndParticipant)(tracks, constants_1.MEDIA_TYPE.VIDEO, participantId);
    if ((0, functions_2.isScreenShareParticipant)(participant)) {
        videoTrack = (0, functions_web_1.getVirtualScreenshareParticipantTrack)(tracks, participant?.id ?? '');
    }
    const _isConnectionStatusInactive = (0, functions_3.isTrackStreamingStatusInactive)(videoTrack);
    const _isConnectionStatusInterrupted = (0, functions_3.isTrackStreamingStatusInterrupted)(videoTrack);
    return {
        _audioSsrc: audioTrack ? conference?.getSsrcByTrack(audioTrack.jitsiTrack) : undefined,
        _disableShowMoreStats: Boolean(state['features/base/config'].disableShowMoreStats),
        _enableAssumedBandwidth: state['features/base/config'].testing?.assumeBandwidth,
        _enableSaveLogs: Boolean(state['features/base/config'].enableSaveLogs),
        _isConnectionStatusInactive,
        _isConnectionStatusInterrupted,
        _isE2EEVerified: Boolean(participant?.e2eeVerified),
        _isNarrowLayout: isNarrowLayout,
        _isVirtualScreenshareParticipant: (0, functions_2.isScreenShareParticipant)(participant),
        _isLocalVideo: Boolean(participant?.local),
        _region: participant?.region,
        _videoSsrc: videoTrack ? conference?.getSsrcByTrack(videoTrack.jitsiTrack) : undefined
    };
}
exports._mapStateToProps = _mapStateToProps;
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps, _mapDispatchToProps)(ConnectionIndicatorContent));
