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
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const constants_1 = require("../../../base/flags/constants");
const functions_2 = require("../../../base/flags/functions");
const functions_3 = require("../../../base/i18n/functions");
const actions_1 = require("../../../base/participants/actions");
const functions_4 = require("../../../base/participants/functions");
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const constants_native_1 = require("../../../base/ui/constants.native");
const styles_1 = __importDefault(require("./styles"));
/**
 * An implementation of a button to raise or lower hand.
 */
class RaiseHandButton extends react_1.Component {
    /**
     * Initializes a new {@code RaiseHandButton} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code RaiseHandButton} instance with.
     */
    constructor(props) {
        super(props);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.raiseHand';
        this.label = 'toolbar.raiseYourHand';
        this.toggledLabel = 'toolbar.lowerYourHand';
        // Bind event handlers so they are only bound once per instance.
        this._onClick = this._onClick.bind(this);
        this._toggleRaisedHand = this._toggleRaisedHand.bind(this);
        this._getLabel = this._getLabel.bind(this);
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @returns {void}
     */
    _onClick() {
        this._toggleRaisedHand();
        this.props.onCancel();
    }
    /**
     * Toggles the rased hand status of the local participant.
     *
     * @returns {void}
     */
    _toggleRaisedHand() {
        const enable = !this.props._raisedHand;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('raise.hand', { enable }));
        this.props.dispatch((0, actions_1.raiseHand)(enable));
    }
    /**
     * Gets the current label, taking the toggled state into account. If no
     * toggled label is provided, the regular label will also be used in the
     * toggled state.
     *
     * @returns {string}
     */
    _getLabel() {
        const { _raisedHand, t } = this.props;
        return t(_raisedHand ? this.toggledLabel : this.label);
    }
    /**
     * Renders the "raise hand" emoji.
     *
     * @returns {ReactElement}
     */
    _renderRaiseHandEmoji() {
        return (<react_native_paper_1.Text>✋</react_native_paper_1.Text>);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _enabled } = this.props;
        if (!_enabled) {
            return null;
        }
        return (<Button_1.default accessibilityLabel={this.accessibilityLabel} icon={this._renderRaiseHandEmoji} labelKey={this._getLabel()} onClick={this._onClick} style={styles_1.default.raiseHandButton} type={constants_native_1.BUTTON_TYPES.SECONDARY}/>);
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const _localParticipant = (0, functions_4.getLocalParticipant)(state);
    const enabled = (0, functions_2.getFeatureFlag)(state, constants_1.RAISE_HAND_ENABLED, true);
    return {
        _enabled: enabled,
        _localParticipant,
        _raisedHand: (0, functions_4.hasRaisedHand)(_localParticipant)
    };
}
exports.default = (0, functions_3.translate)((0, react_redux_1.connect)(_mapStateToProps)(RaiseHandButton));
