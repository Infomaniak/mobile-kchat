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
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/participants/functions");
const styles_1 = __importDefault(require("./styles"));
/**
 * Renders a label with the display name of the on-stage participant.
 */
class DisplayNameLabel extends React.Component {
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        if (!this.props._render) {
            return null;
        }
        return (<react_native_1.View style={(this.props.contained ? styles_1.default.displayNamePadding : styles_1.default.displayNameBackdrop)}>
                <react_native_1.Text numberOfLines={1} style={styles_1.default.displayNameText}>
                    {this.props._participantName}
                </react_native_1.Text>
            </react_native_1.View>);
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {any} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const participant = (0, functions_1.getParticipantById)(state, ownProps.participantId ?? '');
    return {
        _participantName: (0, functions_1.getParticipantDisplayName)(state, ownProps.participantId ?? ''),
        _render: Boolean(participant && (!participant?.local || ownProps.contained)
            && (!participant?.fakeParticipant || (0, functions_1.isScreenShareParticipant)(participant)))
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(DisplayNameLabel);
