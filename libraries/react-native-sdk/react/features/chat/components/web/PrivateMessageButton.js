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
const mui_1 = require("tss-react/mui");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const svg_1 = require("../../../base/icons/svg");
const functions_2 = require("../../../base/participants/functions");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const constants_any_1 = require("../../../base/ui/constants.any");
const actions_web_1 = require("../../actions.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        replyButton: {
            padding: '2px',
            '&:hover': {
                backgroundColor: theme.palette.action03
            }
        }
    };
});
const PrivateMessageButton = ({ participantID, isLobbyMessage, visible }) => {
    const { classes } = useStyles();
    const dispatch = (0, react_redux_1.useDispatch)();
    const participant = (0, react_redux_1.useSelector)((state) => (0, functions_2.getParticipantById)(state, participantID));
    const isVisible = (0, react_redux_1.useSelector)((state) => (0, functions_1.getFeatureFlag)(state, constants_1.CHAT_ENABLED, true)) ?? visible;
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleClick = (0, react_1.useCallback)(() => {
        if (isLobbyMessage) {
            dispatch((0, actions_web_1.handleLobbyChatInitialized)(participantID));
        }
        else {
            dispatch((0, actions_web_1.openChat)(participant));
        }
    }, []);
    if (!isVisible) {
        return null;
    }
    return (react_1.default.createElement(Button_1.default, { accessibilityLabel: t('toolbar.accessibilityLabel.privateMessage'), className: classes.replyButton, icon: svg_1.IconReply, onClick: handleClick, type: constants_any_1.BUTTON_TYPES.TERTIARY }));
};
exports.default = PrivateMessageButton;
