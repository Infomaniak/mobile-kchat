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
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const actions_1 = require("../../../base/dialog/actions");
const BottomSheet_1 = __importDefault(require("../../../base/dialog/components/native/BottomSheet"));
const styles_1 = require("../../../base/dialog/components/native/styles");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const constants_1 = require("../../../base/media/constants");
const functions_2 = require("../../../base/participants/functions");
const BaseIndicator_1 = __importDefault(require("../../../base/react/components/native/BaseIndicator"));
const functions_native_1 = require("../../../base/tracks/functions.native");
const functions_3 = require("../../../connection-indicator/functions");
const statsEmitter_1 = __importDefault(require("../../../connection-indicator/statsEmitter"));
const styles_2 = __importDefault(require("./styles"));
/**
 * Size of the rendered avatar in the menu.
 */
const AVATAR_SIZE = 25;
const CONNECTION_QUALITY = [
    // Full (3 bars)
    {
        msg: 'connectionindicator.quality.good',
        percent: 30 // INDICATOR_DISPLAY_THRESHOLD
    },
    // 2 bars.
    {
        msg: 'connectionindicator.quality.nonoptimal',
        percent: 10
    },
    // 1 bar.
    {
        msg: 'connectionindicator.quality.poor',
        percent: 0
    }
];
/**
 * Class to implement a popup menu that show the connection statistics.
 */
class ConnectionStatusComponent extends react_1.PureComponent {
    /**
     * Constructor of the component.
     *
     * @param {P} props - The read-only properties with which the new
     * instance is to be initialized.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onStatsUpdated = this._onStatsUpdated.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._renderMenuHeader = this._renderMenuHeader.bind(this);
        this.state = {
            resolutionString: 'N/A',
            downloadString: 'N/A',
            uploadString: 'N/A',
            packetLostDownloadString: 'N/A',
            packetLostUploadString: 'N/A',
            serverRegionString: 'N/A',
            codecString: 'N/A',
            connectionString: 'N/A'
        };
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactNode}
     */
    render() {
        const { t, theme } = this.props;
        const { palette } = theme;
        return (<BottomSheet_1.default onCancel={this._onCancel} renderHeader={this._renderMenuHeader}>
                <react_native_1.View style={styles_2.default.statsWrapper}>
                    <react_native_1.View style={styles_2.default.statsInfoCell}>
                        <react_native_1.Text style={styles_2.default.statsTitleText}>
                            {t('connectionindicator.status')}
                        </react_native_1.Text>
                        <react_native_1.Text style={styles_2.default.statsInfoText}>
                            {t(this.state.connectionString)}
                        </react_native_1.Text>
                    </react_native_1.View>
                    <react_native_1.View style={styles_2.default.statsInfoCell}>
                        <react_native_1.Text style={styles_2.default.statsTitleText}>
                            {t('connectionindicator.bitrate')}
                        </react_native_1.Text>
                        <BaseIndicator_1.default icon={svg_1.IconArrowDownLarge} iconStyle={{
                color: palette.icon03
            }}/>
                        <react_native_1.Text style={styles_2.default.statsInfoText}>
                            {this.state.downloadString}
                        </react_native_1.Text>
                        <BaseIndicator_1.default icon={svg_1.IconArrowUpLarge} iconStyle={{
                color: palette.icon03
            }}/>
                        <react_native_1.Text style={styles_2.default.statsInfoText}>
                            {`${this.state.uploadString} Kbps`}
                        </react_native_1.Text>
                    </react_native_1.View>
                    <react_native_1.View style={styles_2.default.statsInfoCell}>
                        <react_native_1.Text style={styles_2.default.statsTitleText}>
                            {t('connectionindicator.packetloss')}
                        </react_native_1.Text>
                        <BaseIndicator_1.default icon={svg_1.IconArrowDownLarge} iconStyle={{
                color: palette.icon03
            }}/>
                        <react_native_1.Text style={styles_2.default.statsInfoText}>
                            {this.state.packetLostDownloadString}
                        </react_native_1.Text>
                        <BaseIndicator_1.default icon={svg_1.IconArrowUpLarge} iconStyle={{
                color: palette.icon03
            }}/>
                        <react_native_1.Text style={styles_2.default.statsInfoText}>
                            {this.state.packetLostUploadString}
                        </react_native_1.Text>
                    </react_native_1.View>
                    <react_native_1.View style={styles_2.default.statsInfoCell}>
                        <react_native_1.Text style={styles_2.default.statsTitleText}>
                            {t('connectionindicator.resolution')}
                        </react_native_1.Text>
                        <react_native_1.Text style={styles_2.default.statsInfoText}>
                            {this.state.resolutionString}
                        </react_native_1.Text>
                    </react_native_1.View>
                    <react_native_1.View style={styles_2.default.statsInfoCell}>
                        <react_native_1.Text style={styles_2.default.statsTitleText}>
                            {t('connectionindicator.codecs')}
                        </react_native_1.Text>
                        <react_native_1.Text style={styles_2.default.statsInfoText}>
                            {this.state.codecString}
                        </react_native_1.Text>
                    </react_native_1.View>
                </react_native_1.View>
            </BottomSheet_1.default>);
    }
    /**
     * Starts listening for stat updates.
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidMount() {
        statsEmitter_1.default.subscribeToClientStats(this.props.participantID, this._onStatsUpdated);
    }
    /**
     * Updates which user's stats are being listened to.
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidUpdate(prevProps) {
        if (prevProps.participantID !== this.props.participantID) {
            statsEmitter_1.default.unsubscribeToClientStats(prevProps.participantID, this._onStatsUpdated);
            statsEmitter_1.default.subscribeToClientStats(this.props.participantID, this._onStatsUpdated);
        }
    }
    /**
     * Callback invoked when new connection stats associated with the passed in
     * user ID are available. Will update the component's display of current
     * statistics.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {void}
     */
    _onStatsUpdated(stats = {}) {
        const newState = this._buildState(stats);
        this.setState(newState);
    }
    /**
     * Extracts statistics and builds the state object.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {State}
     */
    _buildState(stats) {
        const { download: downloadBitrate, upload: uploadBitrate } = this._extractBitrate(stats) ?? {};
        const { download: downloadPacketLost, upload: uploadPacketLost } = this._extractPacketLost(stats) ?? {};
        return {
            resolutionString: this._extractResolutionString(stats) ?? this.state.resolutionString,
            downloadString: downloadBitrate ?? this.state.downloadString,
            uploadString: uploadBitrate ?? this.state.uploadString,
            packetLostDownloadString: downloadPacketLost === undefined
                ? this.state.packetLostDownloadString : `${downloadPacketLost}%`,
            packetLostUploadString: uploadPacketLost === undefined
                ? this.state.packetLostUploadString : `${uploadPacketLost}%`,
            serverRegionString: this._extractServer(stats) ?? this.state.serverRegionString,
            codecString: this._extractCodecs(stats) ?? this.state.codecString,
            connectionString: this._extractConnection(stats)
        };
    }
    /**
     * Extracts the resolution and framerate.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {string}
     */
    _extractResolutionString(stats) {
        const { framerate, resolution } = stats;
        const resolutionString = Object.keys(resolution || {})
            .map(ssrc => {
            const { width, height } = resolution[ssrc];
            return `${width}x${height}`;
        })
            .join(', ') || null;
        const frameRateString = Object.keys(framerate || {})
            .map(ssrc => framerate[ssrc])
            .join(', ') || null;
        return resolutionString && frameRateString ? `${resolutionString}@${frameRateString}fps` : undefined;
    }
    /**
     * Extracts the download and upload bitrates.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {{ download, upload }}
     */
    _extractBitrate(stats) {
        return stats.bitrate;
    }
    /**
     * Extracts the download and upload packet lost.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {{ download, upload }}
     */
    _extractPacketLost(stats) {
        return stats.packetLoss;
    }
    /**
     * Extracts the server name.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {string}
     */
    _extractServer(stats) {
        return stats.serverRegion;
    }
    /**
     * Extracts the audio and video codecs names.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {string}
     */
    _extractCodecs(stats) {
        const { codec } = stats;
        let codecString;
        if (codec) {
            const audioCodecs = Object.values(codec)
                .map((c) => c.audio)
                .filter(Boolean);
            const videoCodecs = Object.values(codec)
                .map((c) => c.video)
                .filter(Boolean);
            if (audioCodecs.length || videoCodecs.length) {
                // Use a Set to eliminate duplicates.
                codecString = Array.from(new Set([...audioCodecs, ...videoCodecs])).join(', ');
            }
        }
        return codecString;
    }
    /**
     * Extracts the connection percentage and sets connection quality.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {string}
     */
    _extractConnection(stats) {
        const { connectionQuality } = stats;
        const { _isConnectionStatusInactive, _isConnectionStatusInterrupted } = this.props;
        if (_isConnectionStatusInactive) {
            return 'connectionindicator.quality.inactive';
        }
        else if (_isConnectionStatusInterrupted) {
            return 'connectionindicator.quality.lost';
        }
        else if (typeof connectionQuality === 'undefined') {
            return 'connectionindicator.quality.good';
        }
        const qualityConfig = this._getQualityConfig(connectionQuality);
        return qualityConfig.msg;
    }
    /**
     * Get the quality configuration from CONNECTION_QUALITY which has a percentage
     * that matches or exceeds the passed in percentage. The implementation
     * assumes CONNECTION_QUALITY is already sorted by highest to lowest
     * percentage.
     *
     * @param {number} percent - The connection percentage, out of 100, to find
     * the closest matching configuration for.
     * @private
     * @returns {Object}
     */
    _getQualityConfig(percent) {
        return CONNECTION_QUALITY.find(x => percent >= x.percent) || {};
    }
    /**
     * Callback to hide the {@code ConnectionStatusComponent}.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel() {
        statsEmitter_1.default.unsubscribeToClientStats(this.props.participantID, this._onStatsUpdated);
        this.props.dispatch((0, actions_1.hideSheet)());
    }
    /**
     * Function to render the menu's header.
     *
     * @returns {React$Element}
     */
    _renderMenuHeader() {
        const { participantID } = this.props;
        return (<react_native_1.View style={[
                styles_1.bottomSheetStyles.sheet,
                styles_2.default.participantNameContainer
            ]}>
                <Avatar_1.default participantId={participantID} size={AVATAR_SIZE}/>
                <react_native_1.Text style={styles_2.default.participantNameLabel}>
                    {this.props._participantDisplayName}
                </react_native_1.Text>
            </react_native_1.View>);
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Object} ownProps - Properties of component.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state, ownProps) {
    const { participantID } = ownProps;
    const tracks = state['features/base/tracks'];
    const _videoTrack = (0, functions_native_1.getTrackByMediaTypeAndParticipant)(tracks, constants_1.MEDIA_TYPE.VIDEO, participantID);
    const _isConnectionStatusInactive = (0, functions_3.isTrackStreamingStatusInactive)(_videoTrack);
    const _isConnectionStatusInterrupted = (0, functions_3.isTrackStreamingStatusInterrupted)(_videoTrack);
    return {
        _isConnectionStatusInactive,
        _isConnectionStatusInterrupted,
        _participantDisplayName: (0, functions_2.getParticipantDisplayName)(state, participantID)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)((0, react_native_paper_1.withTheme)(ConnectionStatusComponent)));
