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
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const svg_1 = require("../../../base/icons/svg");
const constants_1 = require("../../../base/media/constants");
const functions_1 = require("../../../base/participants/functions");
const BaseIndicator_1 = __importDefault(require("../../../base/react/components/native/BaseIndicator"));
const functions_native_1 = require("../../../base/tracks/functions.native");
const styles_1 = __importDefault(require("../../../filmstrip/components/native/styles"));
const functions_2 = require("../../functions");
const AbstractConnectionIndicator_1 = __importStar(require("../AbstractConnectionIndicator"));
const styles_2 = require("./styles");
/**
 * Implements an indicator to show the quality of the connection of a participant.
 */
class ConnectionIndicator extends AbstractConnectionIndicator_1.default {
    /**
     * Initializes a new {@code ConnectionIndicator} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            autoHideTimeout: undefined,
            showIndicator: false,
            stats: {}
        };
    }
    /**
     * Get the icon configuration from CONNECTOR_INDICATOR_COLORS which has a percentage
     * that matches or exceeds the passed in percentage. The implementation
     * assumes CONNECTOR_INDICATOR_COLORS is already sorted by highest to lowest
     * percentage.
     *
     * @param {number} percent - The connection percentage, out of 100, to find
     * the closest matching configuration for.
     * @private
     * @returns {Object}
     */
    _getDisplayConfiguration(percent) {
        return styles_2.CONNECTOR_INDICATOR_COLORS.find(x => percent >= x.percent) || {};
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _connectionIndicatorInactiveDisabled, _connectionIndicatorDisabled, _isVirtualScreenshareParticipant, _isConnectionStatusInactive, _isConnectionStatusInterrupted } = this.props;
        const { showIndicator, stats } = this.state;
        const { percent } = stats;
        if (!showIndicator || typeof percent === 'undefined'
            || _connectionIndicatorDisabled || _isVirtualScreenshareParticipant) {
            return null;
        }
        let indicatorColor;
        if (_isConnectionStatusInactive) {
            if (_connectionIndicatorInactiveDisabled) {
                return null;
            }
            indicatorColor = styles_2.CONNECTOR_INDICATOR_OTHER;
        }
        else if (_isConnectionStatusInterrupted) {
            indicatorColor = styles_2.CONNECTOR_INDICATOR_LOST;
        }
        else {
            const displayConfig = this._getDisplayConfiguration(percent);
            if (!displayConfig) {
                return null;
            }
            indicatorColor = displayConfig.color;
        }
        return (<react_native_1.View style={[
                styles_1.default.indicatorContainer,
                { backgroundColor: indicatorColor }
            ]}>
                <BaseIndicator_1.default icon={svg_1.IconConnection} iconStyle={this.props.iconStyle || styles_2.iconStyle}/>
            </react_native_1.View>);
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
    const participant = participantId ? (0, functions_1.getParticipantById)(state, participantId) : (0, functions_1.getLocalParticipant)(state);
    const _isVirtualScreenshareParticipant = (0, functions_1.isScreenShareParticipant)(participant);
    let _isConnectionStatusInactive;
    let _isConnectionStatusInterrupted;
    if (!_isVirtualScreenshareParticipant) {
        const _videoTrack = (0, functions_native_1.getTrackByMediaTypeAndParticipant)(tracks, constants_1.MEDIA_TYPE.VIDEO, participantId);
        _isConnectionStatusInactive = (0, functions_2.isTrackStreamingStatusInactive)(_videoTrack);
        _isConnectionStatusInterrupted = (0, functions_2.isTrackStreamingStatusInterrupted)(_videoTrack);
    }
    return {
        ...(0, AbstractConnectionIndicator_1.mapStateToProps)(state),
        _connectionIndicatorInactiveDisabled: Boolean(state['features/base/config'].connectionIndicators?.inactiveDisabled),
        _connectionIndicatorDisabled: Boolean(state['features/base/config'].connectionIndicators?.disabled),
        _isVirtualScreenshareParticipant,
        _isConnectionStatusInactive,
        _isConnectionStatusInterrupted
    };
}
exports._mapStateToProps = _mapStateToProps;
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(ConnectionIndicator);
