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
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const svg_1 = require("../../../base/icons/svg");
const ContextMenuItem_1 = __importDefault(require("../../../base/ui/components/web/ContextMenuItem"));
const actions_1 = require("../../../e2ee/actions");
const types_1 = require("../../../toolbox/types");
/**
 * Implements a React {@link Component} which displays a button that
 * verifies the participant.
 *
 * @returns {JSX.Element}
 */
const VerifyParticipantButton = ({ notifyClick, notifyMode, participantID }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const _handleClick = (0, react_1.useCallback)(() => {
        notifyClick?.();
        if (notifyMode === types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY) {
            return;
        }
        dispatch((0, actions_1.startVerification)(participantID));
    }, [dispatch, notifyClick, notifyMode, participantID]);
    return (react_1.default.createElement(ContextMenuItem_1.default, { accessibilityLabel: t('videothumbnail.verify'), className: 'verifylink', icon: svg_1.IconCheck, id: `verifylink_${participantID}`, 
        // eslint-disable-next-line react/jsx-handler-names
        onClick: _handleClick, text: t('videothumbnail.verify') }));
};
exports.default = VerifyParticipantButton;
