"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
/**
 * A component that renders the description of the notification for the recording initiator.
 *
 * @param {IProps} props - The props of the component.
 * @returns {Component}
 */
function RecordingLimitNotificationDescription(props) {
    const { _limit, _appName, _appURL, isLiveStreaming, t } = props;
    return (react_1.default.createElement("span", null, (0, functions_1.translateToHTML)(t, `${isLiveStreaming ? 'liveStreaming' : 'recording'}.limitNotificationDescriptionWeb`, {
        limit: _limit,
        app: _appName,
        url: _appURL
    })));
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { recordingLimit = {} } = state['features/base/config'];
    const { limit: _limit, appName: _appName, appURL: _appURL } = recordingLimit;
    return {
        _limit,
        _appName,
        _appURL
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(RecordingLimitNotificationDescription));
