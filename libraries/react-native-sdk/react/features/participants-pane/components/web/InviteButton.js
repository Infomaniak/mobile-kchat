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
exports.InviteButton = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const svg_1 = require("../../../base/icons/svg");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const constants_web_1 = require("../../../base/ui/constants.web");
const actions_1 = require("../../../invite/actions");
const types_1 = require("../../../toolbox/types");
const INVITE_BUTTON_KEY = 'invite';
const InviteButton = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const notifyMode = (0, react_redux_1.useSelector)((state) => state['features/toolbox'].buttonsWithNotifyClick?.get(INVITE_BUTTON_KEY));
    const onInvite = (0, react_1.useCallback)(() => {
        if (notifyMode) {
            APP.API.notifyToolbarButtonClicked(INVITE_BUTTON_KEY, notifyMode === types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY);
        }
        if (notifyMode === types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY) {
            return;
        }
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)(INVITE_BUTTON_KEY));
        dispatch((0, actions_1.beginAddPeople)());
    }, [dispatch, notifyMode]);
    return (react_1.default.createElement(Button_1.default, { accessibilityLabel: t('participantsPane.actions.invite'), fullWidth: true, icon: svg_1.IconAddUser, labelKey: 'participantsPane.actions.invite', onClick: onInvite, type: constants_web_1.BUTTON_TYPES.PRIMARY }));
};
exports.InviteButton = InviteButton;
