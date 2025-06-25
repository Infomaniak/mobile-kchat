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
const actions_web_1 = require("../../../filmstrip/actions.web");
const functions_web_1 = require("../../../filmstrip/functions.web");
const types_1 = require("../../../toolbox/types");
const TogglePinToStageButton = ({ className, noIcon = false, notifyClick, notifyMode, onClick, participantID }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const isActive = Boolean((0, react_redux_1.useSelector)(functions_web_1.getPinnedActiveParticipants)
        .find(p => p.participantId === participantID));
    const _onClick = (0, react_1.useCallback)(() => {
        notifyClick?.();
        if (notifyMode === types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY) {
            return;
        }
        dispatch((0, actions_web_1.togglePinStageParticipant)(participantID));
        onClick?.();
    }, [dispatch, isActive, notifyClick, onClick, participantID]);
    const text = isActive
        ? t('videothumbnail.unpinFromStage')
        : t('videothumbnail.pinToStage');
    const icon = isActive ? svg_1.IconPinned : svg_1.IconPin;
    return (react_1.default.createElement(ContextMenuItem_1.default, { accessibilityLabel: text, icon: noIcon ? null : icon, onClick: _onClick, text: text, textClassName: className }));
};
exports.default = TogglePinToStageButton;
