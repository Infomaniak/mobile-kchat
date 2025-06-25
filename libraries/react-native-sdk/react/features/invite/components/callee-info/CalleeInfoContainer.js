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
const CalleeInfo_1 = __importDefault(require("./CalleeInfo"));
/**
 * Implements a React {@link Component} which depicts the establishment of a
 * call with a specific remote callee if there is such a remote callee.
 *
 * @augments Component
 */
class CalleeInfoContainer extends react_1.Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return this.props._calleeInfoVisible ? react_1.default.createElement(CalleeInfo_1.default, null) : null;
    }
}
/**
 * Maps parts of the redux state to {@link CalleeInfoContainer} (React
 * {@code Component}) props.
 *
 * @param {Object} state - The redux state of which parts are to be mapped to
 * {@code CalleeInfoContainer} props.
 * @private
 * @returns {{
 *     _calleeInfoVisible: boolean
 * }}
 */
function _mapStateToProps(state) {
    return {
        /**
         * The indicator which determines whether {@code CalleeInfo} is to be
         * rendered.
         *
         * @private
         * @type {boolean}
         */
        _calleeInfoVisible: Boolean(state['features/invite'].calleeInfoVisible)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(CalleeInfoContainer);
