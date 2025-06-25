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
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const functions_1 = require("../../../base/participants/functions");
/**
 * A React {@code Component} for displaying a profile avatar as an
 * icon.
 *
 * @augments Component
 */
class ProfileButtonAvatar extends react_1.Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _localParticipant } = this.props;
        return (react_1.default.createElement(Avatar_1.default, { participantId: _localParticipant?.id, size: 20 }));
    }
}
/**
 * Maps (parts of) the Redux state to the associated
 * {@code ProfileButtonAvatar} component's props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _localParticipant: Object,
 * }}
 */
function _mapStateToProps(state) {
    return {
        _localParticipant: (0, functions_1.getLocalParticipant)(state)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(ProfileButtonAvatar);
