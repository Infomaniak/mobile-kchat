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
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const actions_1 = require("../../../base/dialog/actions");
const svg_1 = require("../../../base/icons/svg");
const ContextMenuItem_1 = __importDefault(require("../../../base/ui/components/web/ContextMenuItem"));
const types_1 = require("../../../toolbox/types");
const MuteEveryoneDialog_1 = __importDefault(require("./MuteEveryoneDialog"));
/**
 * Implements a React {@link Component} which displays a button for audio muting
 * every participant in the conference except the one with the given
 * participantID.
 *
 * @returns {JSX.Element}
 */
const MuteEveryoneElseButton = ({ notifyClick, notifyMode, participantID }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const handleClick = (0, react_1.useCallback)(() => {
        notifyClick?.();
        if (notifyMode === types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY) {
            return;
        }
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('mute.everyoneelse.pressed'));
        dispatch((0, actions_1.openDialog)(MuteEveryoneDialog_1.default, { exclude: [participantID] }));
    }, [dispatch, notifyMode, notifyClick, participantID, functions_1.sendAnalytics]);
    return (react_1.default.createElement(ContextMenuItem_1.default, { accessibilityLabel: t('toolbar.accessibilityLabel.muteEveryoneElse'), icon: svg_1.IconMicSlash, onClick: handleClick, text: t('videothumbnail.domuteOthers') }));
};
exports.default = MuteEveryoneElseButton;
