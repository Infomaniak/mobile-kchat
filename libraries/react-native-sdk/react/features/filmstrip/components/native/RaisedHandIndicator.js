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
const react_redux_1 = require("react-redux");
const svg_1 = require("../../../base/icons/svg");
const functions_1 = require("../../../base/participants/functions");
const BaseIndicator_1 = __importDefault(require("../../../base/react/components/native/BaseIndicator"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Thumbnail badge showing that the participant would like to speak.
 *
 * @augments Component
 */
class RaisedHandIndicator extends react_1.Component {
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        if (!this.props._raisedHand) {
            return null;
        }
        return this._renderIndicator();
    }
    /**
     * Renders the platform specific indicator element.
     *
     * @returns {React$Element<*>}
     */
    _renderIndicator() {
        return (<react_native_1.View style={styles_1.default.raisedHandIndicator}>
                <BaseIndicator_1.default icon={svg_1.IconRaiseHand} iconStyle={styles_1.default.raisedHandIcon}/>
            </react_native_1.View>);
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {Object}
 */
function _mapStateToProps(state, ownProps) {
    const participant = (0, functions_1.getParticipantById)(state, ownProps.participantId);
    return {
        _raisedHand: (0, functions_1.hasRaisedHand)(participant)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(RaisedHandIndicator);
