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
exports.mapStateToProps = void 0;
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../../base/dialog/actions");
const constants_1 = require("../../../../base/flags/constants");
const functions_1 = require("../../../../base/flags/functions");
const functions_2 = require("../../../../base/i18n/functions");
const ConferenceNavigationContainerRef_1 = require("../../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../../mobile/navigation/routes");
const AbstractLiveStreamButton_1 = __importStar(require("../AbstractLiveStreamButton"));
const StopLiveStreamDialog_1 = __importDefault(require("./StopLiveStreamDialog"));
/**
 * Button for opening the live stream settings screen.
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
        if (_isLiveStreamRunning) {
            dispatch((0, actions_1.openDialog)(StopLiveStreamDialog_1.default));
        }
        else {
            (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.liveStream);
        }
    }
}
/**
 * Maps (parts of) the redux state to the associated props for this component.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component
 * instance.
 * @private
 * @returns {Props}
 */
function mapStateToProps(state, ownProps) {
    const enabled = (0, functions_1.getFeatureFlag)(state, constants_1.LIVE_STREAMING_ENABLED, true);
    const abstractProps = (0, AbstractLiveStreamButton_1._mapStateToProps)(state, ownProps);
    return {
        ...abstractProps,
        visible: enabled && abstractProps.visible
    };
}
exports.mapStateToProps = mapStateToProps;
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(LiveStreamButton));
