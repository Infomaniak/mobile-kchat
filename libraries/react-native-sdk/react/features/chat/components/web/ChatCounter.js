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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../polls/functions");
const functions_2 = require("../../functions");
/**
 * Implements a React {@link Component} which displays a count of the number of
 * unread chat messages.
 *
 * @augments Component
 */
class ChatCounter extends react_1.Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (react_1.default.createElement("span", { className: 'badge-round' },
            react_1.default.createElement("span", null, !this.props._isOpen
                && (this.props._count || null))));
    }
}
/**
 * Maps (parts of) the Redux state to the associated {@code ChatCounter}'s
 * props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _count: number
 * }}
 */
function _mapStateToProps(state) {
    const { isOpen } = state['features/chat'];
    return {
        _count: (0, functions_2.getUnreadCount)(state) + (0, functions_1.getUnreadPollCount)(state),
        _isOpen: isOpen
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(ChatCounter);
