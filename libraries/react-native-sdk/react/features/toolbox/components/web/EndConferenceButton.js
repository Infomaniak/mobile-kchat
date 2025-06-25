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
exports.EndConferenceButton = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/conference/actions");
const functions_1 = require("../../../base/participants/functions");
const constants_web_1 = require("../../../base/ui/constants.web");
const functions_2 = require("../../../breakout-rooms/functions");
const HangupContextMenuItem_1 = require("./HangupContextMenuItem");
/**
 * Button to end the conference for all participants.
 *
 * @param {Object} props - Component's props.
 * @returns {JSX.Element} - The end conference button.
 */
const EndConferenceButton = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const _isLocalParticipantModerator = (0, react_redux_1.useSelector)(functions_1.isLocalParticipantModerator);
    const _isInBreakoutRoom = (0, react_redux_1.useSelector)(functions_2.isInBreakoutRoom);
    const onEndConference = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.endConference)());
    }, [dispatch]);
    return (react_1.default.createElement(react_1.default.Fragment, null, !_isInBreakoutRoom && _isLocalParticipantModerator && react_1.default.createElement(HangupContextMenuItem_1.HangupContextMenuItem, { accessibilityLabel: t('toolbar.accessibilityLabel.endConference'), buttonKey: props.buttonKey, buttonType: constants_web_1.BUTTON_TYPES.DESTRUCTIVE, label: t('toolbar.endConference'), notifyMode: props.notifyMode, onClick: onEndConference })));
};
exports.EndConferenceButton = EndConferenceButton;
