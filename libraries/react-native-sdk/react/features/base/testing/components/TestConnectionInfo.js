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
const statsEmitter_1 = __importDefault(require("../../../connection-indicator/statsEmitter"));
const functions_1 = require("../../participants/functions");
const functions_2 = require("../functions");
const TestHint_1 = __importDefault(require("./TestHint"));
/**
 * The component will expose some of the app state to the jitsi-meet-torture
 * through the UI accessibility layer which is visible to the tests. The Web
 * tests currently will execute JavaScript and access globals variables to learn
 * this information, but there's no such option on React Native(maybe that's
 * a good thing).
 */
class TestConnectionInfo extends react_1.Component {
    /**
     * Initializes new <tt>TestConnectionInfo</tt> instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this._onStatsUpdated = this._onStatsUpdated.bind(this);
        this.state = {
            stats: {
                bitrate: {
                    download: 0,
                    upload: 0
                }
            }
        };
    }
    /**
     * The {@link statsEmitter} callback hoked up for the local participant.
     *
     * @param {Object} stats - These are the RTP stats. Look in
     * the lib-jitsi-meet for more details on the actual structure or add
     * a console print and figure out there.
     * @returns {void}
     * @private
     */
    _onStatsUpdated(stats = { bitrate: { download: undefined,
            upload: undefined } }) {
        this.setState({
            stats: {
                bitrate: {
                    download: stats.bitrate?.download || 0,
                    upload: stats.bitrate?.upload || 0
                }
            }
        });
    }
    /**
     * Starts listening for the local RTP stat updates.
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidMount() {
        statsEmitter_1.default.subscribeToClientStats(this.props._localUserId, this._onStatsUpdated);
    }
    /**
     * Updates which user's stats are being listened to (the local participant's
     * id changes).
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidUpdate(prevProps) {
        if (prevProps._localUserId !== this.props._localUserId) {
            statsEmitter_1.default.unsubscribeToClientStats(prevProps._localUserId, this._onStatsUpdated);
            statsEmitter_1.default.subscribeToClientStats(this.props._localUserId, this._onStatsUpdated);
        }
    }
    /**
     * Removes the local stats listener.
     *
     * @private
     * @returns {void}
     */
    componentWillUnmount() {
        statsEmitter_1.default.unsubscribeToClientStats(this.props._localUserId, this._onStatsUpdated);
    }
    /**
     * Renders the component if the app is currently running in the test mode
     * (config.testing.testMode == true).
     *
     * @returns {ReactElement|null}
     */
    render() {
        if (!this.props._testMode) {
            return null;
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(TestHint_1.default, { id: 'org.jitsi.meet.conference.connectionState', value: this.props._conferenceConnectionState }),
            react_1.default.createElement(TestHint_1.default, { id: 'org.jitsi.meet.conference.joinedState', value: this.props._conferenceJoinedState }),
            react_1.default.createElement(TestHint_1.default, { id: 'org.jitsi.meet.conference.grantModeratorAvailable', value: 'true' }),
            react_1.default.createElement(TestHint_1.default, { id: 'org.jitsi.meet.conference.localParticipantRole', value: this.props._localUserRole }),
            react_1.default.createElement(TestHint_1.default, { id: 'org.jitsi.meet.stats.rtp', value: JSON.stringify(this.state.stats) })));
    }
}
/**
 * Maps (parts of) the Redux state to the associated TestConnectionInfo's props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const conferenceJoined = Boolean(state['features/base/conference'].conference);
    const localParticipant = (0, functions_1.getLocalParticipant)(state);
    return {
        _conferenceConnectionState: state['features/testing'].connectionState,
        _conferenceJoinedState: conferenceJoined.toString(),
        _localUserId: localParticipant?.id ?? '',
        _localUserRole: localParticipant?.role ?? '',
        _testMode: (0, functions_2.isTestModeEnabled)(state)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(TestConnectionInfo);
