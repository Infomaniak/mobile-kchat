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
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../../base/dialog/actions");
const functions_1 = require("../../../../base/i18n/functions");
const AbstractLiveStreamButton_1 = __importStar(require("../AbstractLiveStreamButton"));
const StartLiveStreamDialog_1 = __importDefault(require("./StartLiveStreamDialog"));
const StopLiveStreamDialog_1 = __importDefault(require("./StopLiveStreamDialog"));
/**
 * Button for opening the live stream settings dialog.
 */
class LiveStreamButton extends AbstractLiveStreamButton_1.default {
    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _onHandleClick() {
        const { _isLiveStreamRunning, dispatch } = this.props;
        dispatch((0, actions_1.openDialog)(_isLiveStreamRunning ? StopLiveStreamDialog_1.default : StartLiveStreamDialog_1.default));
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code LiveStreamButton} component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the Component.
 * @private
 * @returns {{
 *     _conference: Object,
 *     _isLiveStreamRunning: boolean,
 *     _disabled: boolean,
 *     visible: boolean
 * }}
 */
function _mapStateToProps(state, ownProps) {
    const abstractProps = (0, AbstractLiveStreamButton_1._mapStateToProps)(state, ownProps);
    const { toolbarButtons } = state['features/toolbox'];
    let { visible } = ownProps;
    if (typeof visible === 'undefined') {
        visible = Boolean(toolbarButtons?.includes('livestreaming') && abstractProps.visible);
    }
    return {
        ...abstractProps,
        visible
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(LiveStreamButton));
