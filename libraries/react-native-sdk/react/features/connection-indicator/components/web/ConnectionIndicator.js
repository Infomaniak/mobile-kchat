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
exports._mapStateToProps = void 0;
const clsx_1 = __importDefault(require("clsx"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../base/i18n/functions");
const constants_1 = require("../../../base/media/constants");
const functions_2 = require("../../../base/participants/functions");
const Popover_web_1 = __importDefault(require("../../../base/popover/components/Popover.web"));
const functions_3 = require("../../../base/tracks/functions");
const functions_4 = require("../../functions");
const AbstractConnectionIndicator_1 = __importStar(require("../AbstractConnectionIndicator"));
const ConnectionIndicatorContent_1 = __importDefault(require("./ConnectionIndicatorContent"));
const ConnectionIndicatorIcon_1 = require("./ConnectionIndicatorIcon");
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
        tip: 'connectionindicator.quality.good'
    },
    // 2 bars
    {
        colorClass: 'status-med',
        percent: 10,
        tip: 'connectionindicator.quality.nonoptimal'
    },
    // 1 bar
    {
        colorClass: 'status-low',
        percent: 0,
        tip: 'connectionindicator.quality.poor'
    }
    // Note: we never show 0 bars as long as there is a connection.
];
const styles = (theme) => {
    return {
        container: {
            display: 'inline-block'
        },
        hidden: {
            display: 'none'
        },
        icon: {
            padding: '4px',
            borderRadius: '4px',
            '&.status-high': {
                backgroundColor: theme.palette.success01
            },
            '&.status-med': {
                backgroundColor: theme.palette.warning01
            },
            '&.status-low': {
                backgroundColor: theme.palette.iconError
            },
            '&.status-disabled': {
                background: 'transparent'
            },
            '&.status-lost': {
                backgroundColor: theme.palette.ui05
            },
            '&.status-other': {
                backgroundColor: theme.palette.action01
            }
        },
        inactiveIcon: {
            padding: 0,
            borderRadius: '50%'
        }
    };
};
/**
 * Implements a React {@link Component} which displays the current connection
 * quality percentage and has a popover to show more detailed connection stats.
 *
 * @augments {Component}
 */
class ConnectionIndicator extends AbstractConnectionIndicator_1.default {
    /**
     * Initializes a new {@code ConnectionIndicator} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            showIndicator: false,
            stats: {},
            popoverVisible: false
        };
        this._onShowPopover = this._onShowPopover.bind(this);
        this._onHidePopover = this._onHidePopover.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { enableStatsDisplay, participantId, statsPopoverPosition, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        const visibilityClass = this._getVisibilityClass();
        if (this.props._popoverDisabled) {
            return this._renderIndicator();
        }
        return (react_1.default.createElement(Popover_web_1.default, { className: (0, clsx_1.default)(classes.container, visibilityClass), content: react_1.default.createElement(ConnectionIndicatorContent_1.default, { inheritedStats: this.state.stats, participantId: participantId }), disablePopover: !enableStatsDisplay, headingLabel: t('videothumbnail.connectionInfo'), id: 'participant-connection-indicator', onPopoverClose: this._onHidePopover, onPopoverOpen: this._onShowPopover, position: statsPopoverPosition, visible: this.state.popoverVisible }, this._renderIndicator()));
    }
    /**
     * Returns a CSS class that interprets the current connection status as a
     * color.
     *
     * @private
     * @returns {string}
     */
    _getConnectionColorClass() {
        // TODO We currently do not have logic to emit and handle stats changes for tracks.
        const { percent } = this.state.stats;
        const { _isConnectionStatusInactive, _isConnectionStatusInterrupted, _connectionIndicatorInactiveDisabled } = this.props;
        if (_isConnectionStatusInactive) {
            if (_connectionIndicatorInactiveDisabled) {
                return 'status-disabled';
            }
            return 'status-other';
        }
        else if (_isConnectionStatusInterrupted) {
            return 'status-lost';
        }
        else if (typeof percent === 'undefined') {
            return 'status-high';
        }
        return this._getDisplayConfiguration(percent).colorClass;
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
        return QUALITY_TO_WIDTH.find(x => percent >= x.percent) || {};
    }
    /**
     * Returns additional class names to add to the root of the component. The
     * class names are intended to be used for hiding or showing the indicator.
     *
     * @private
     * @returns {string}
     */
    _getVisibilityClass() {
        const { _isConnectionStatusInactive, _isConnectionStatusInterrupted } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        return this.state.showIndicator
            || this.props.alwaysVisible
            || _isConnectionStatusInterrupted
            || _isConnectionStatusInactive
            ? '' : classes.hidden;
    }
    /**
     * Hides popover.
     *
     * @private
     * @returns {void}
     */
    _onHidePopover() {
        this.setState({ popoverVisible: false });
    }
    /**
     * Shows popover.
     *
     * @private
     * @returns {void}
     */
    _onShowPopover() {
        this.setState({ popoverVisible: true });
    }
    /**
     * Creates a ReactElement for displaying the indicator (GSM bar).
     *
     * @returns {ReactElement}
     */
    _renderIndicator() {
        const { _isConnectionStatusInactive, _isConnectionStatusInterrupted, _connectionIndicatorInactiveDisabled, _videoTrack, classes, iconSize, t } = this.props;
        return (react_1.default.createElement("div", { style: { fontSize: iconSize } },
            react_1.default.createElement("span", { className: 'sr-only' }, t('videothumbnail.connectionInfo')),
            react_1.default.createElement(ConnectionIndicatorIcon_1.ConnectionIndicatorIcon, { classes: classes, colorClass: this._getConnectionColorClass(), connectionIndicatorInactiveDisabled: _connectionIndicatorInactiveDisabled, isConnectionStatusInactive: _isConnectionStatusInactive, isConnectionStatusInterrupted: _isConnectionStatusInterrupted, track: _videoTrack })));
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const { participantId } = ownProps;
    const tracks = state['features/base/tracks'];
    const participant = participantId ? (0, functions_2.getParticipantById)(state, participantId) : (0, functions_2.getLocalParticipant)(state);
    let _videoTrack = (0, functions_3.getTrackByMediaTypeAndParticipant)(tracks, constants_1.MEDIA_TYPE.VIDEO, participantId);
    if ((0, functions_2.isScreenShareParticipant)(participant)) {
        _videoTrack = (0, functions_3.getVirtualScreenshareParticipantTrack)(tracks, participantId);
    }
    const _isConnectionStatusInactive = (0, functions_4.isTrackStreamingStatusInactive)(_videoTrack);
    const _isConnectionStatusInterrupted = (0, functions_4.isTrackStreamingStatusInterrupted)(_videoTrack);
    return {
        ...(0, AbstractConnectionIndicator_1.mapStateToProps)(state),
        _connectionIndicatorInactiveDisabled: Boolean(state['features/base/config'].connectionIndicators?.inactiveDisabled),
        _isVirtualScreenshareParticipant: (0, functions_2.isScreenShareParticipant)(participant),
        _popoverDisabled: Boolean(state['features/base/config'].connectionIndicators?.disableDetails),
        _isConnectionStatusInactive,
        _isConnectionStatusInterrupted,
        _videoTrack
    };
}
exports._mapStateToProps = _mapStateToProps;
exports.default = (0, react_redux_1.connect)(_mapStateToProps)((0, functions_1.translate)((0, mui_1.withStyles)(ConnectionIndicator, styles)));
