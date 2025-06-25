"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStateToProps = exports.INDICATOR_DISPLAY_THRESHOLD = void 0;
const react_1 = require("react");
const functions_1 = require("../../base/participants/functions");
const statsEmitter_1 = __importDefault(require("../statsEmitter"));
const defaultAutoHideTimeout = 5000;
/**
 * The connection quality percentage that must be reached to be considered of
 * good quality and can result in the connection indicator being hidden.
 *
 * @type {number}
 */
exports.INDICATOR_DISPLAY_THRESHOLD = 30;
/**
 * Implements a React {@link Component} which displays the current connection
 * quality.
 *
 * @augments {Component}
 */
class AbstractConnectionIndicator extends react_1.Component {
    /**
     * Initializes a new {@code ConnectionIndicator} instance.
     *
     * @param {P} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once for every instance.
        this._onStatsUpdated = this._onStatsUpdated.bind(this);
    }
    /**
     * Starts listening for stat updates.
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidMount() {
        statsEmitter_1.default.subscribeToClientStats(this._getRealParticipantId(this.props), this._onStatsUpdated);
    }
    /**
     * Updates which user's stats are being listened to.
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidUpdate(prevProps) {
        const prevParticipantId = this._getRealParticipantId(prevProps);
        const participantId = this._getRealParticipantId(this.props);
        if (prevParticipantId !== participantId) {
            statsEmitter_1.default.unsubscribeToClientStats(prevParticipantId, this._onStatsUpdated);
            statsEmitter_1.default.subscribeToClientStats(participantId, this._onStatsUpdated);
        }
    }
    /**
     * Cleans up any queued processes, which includes listening for new stats
     * and clearing any timeout to hide the indicator.
     *
     * @private
     * @returns {void}
     */
    componentWillUnmount() {
        statsEmitter_1.default.unsubscribeToClientStats(this._getRealParticipantId(this.props), this._onStatsUpdated);
        clearTimeout(this.autoHideTimeout ?? 0);
    }
    /**
     * Gets the "real" participant ID. FOr a virtual screenshare participant, that is its "owner".
     *
     * @param {Props} props - The props where to extract the data from.
     * @returns {string | undefined } The resolved participant ID.
     */
    _getRealParticipantId(props) {
        if (props._isVirtualScreenshareParticipant) {
            return (0, functions_1.getVirtualScreenshareParticipantOwnerId)(props.participantId);
        }
        return props.participantId;
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
    _onStatsUpdated(stats = { connectionQuality: undefined }) {
        // Rely on React to batch setState actions.
        const { connectionQuality } = stats;
        const newPercentageState = typeof connectionQuality === 'undefined'
            ? {} : { percent: connectionQuality };
        const newStats = Object.assign({}, this.state.stats, stats, newPercentageState);
        this.setState({
            stats: newStats
        });
        this._updateIndicatorAutoHide(newStats.percent ?? 0);
    }
    /**
     * Updates the internal state for automatically hiding the indicator.
     *
     * @param {number} percent - The current connection quality percentage
     * between the values 0 and 100.
     * @private
     * @returns {void}
     */
    _updateIndicatorAutoHide(percent) {
        if (percent < exports.INDICATOR_DISPLAY_THRESHOLD) {
            clearTimeout(this.autoHideTimeout ?? 0);
            this.autoHideTimeout = undefined;
            this.setState({
                showIndicator: true
            });
        }
        else if (this.autoHideTimeout) {
            // This clause is intentionally left blank because no further action
            // is needed if the percent is below the threshold and there is an
            // autoHideTimeout set.
        }
        else {
            this.autoHideTimeout = window.setTimeout(() => {
                this.setState({
                    showIndicator: false
                });
            }, this.props._autoHideTimeout);
        }
    }
}
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code ConnectorIndicator} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function mapStateToProps(state) {
    return {
        _autoHideTimeout: state['features/base/config'].connectionIndicators?.autoHideTimeout ?? defaultAutoHideTimeout
    };
}
exports.mapStateToProps = mapStateToProps;
exports.default = AbstractConnectionIndicator;
