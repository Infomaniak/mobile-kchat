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
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const functions_web_1 = require("../../../base/styles/functions.web");
const PollItem_1 = __importDefault(require("./PollItem"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        },
        emptyIcon: {
            width: '100px',
            padding: '16px',
            '& svg': {
                width: '100%',
                height: 'auto'
            }
        },
        emptyMessage: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyLongBold),
            color: theme.palette.text02,
            padding: '0 24px',
            textAlign: 'center'
        }
    };
});
const PollsList = ({ setCreateMode }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { classes, theme } = useStyles();
    const polls = (0, react_redux_1.useSelector)((state) => state['features/polls'].polls);
    const pollListEndRef = (0, react_1.useRef)(null);
    const scrollToBottom = (0, react_1.useCallback)(() => {
        if (pollListEndRef.current) {
            // Safari does not support options
            const param = lib_jitsi_meet_1.browser.isSafari()
                ? false : {
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            };
            pollListEndRef.current.scrollIntoView(param);
        }
    }, [pollListEndRef.current]);
    (0, react_1.useEffect)(() => {
        scrollToBottom();
    }, [polls]);
    const listPolls = Object.keys(polls);
    return (react_1.default.createElement(react_1.default.Fragment, null, listPolls.length === 0
        ? react_1.default.createElement("div", { className: classes.container },
            react_1.default.createElement(Icon_1.default, { className: classes.emptyIcon, color: theme.palette.icon03, src: svg_1.IconMessage }),
            react_1.default.createElement("span", { className: classes.emptyMessage }, t('polls.results.empty')))
        : listPolls.map((id, index) => (react_1.default.createElement(PollItem_1.default, { key: id, pollId: id, ref: listPolls.length - 1 === index ? pollListEndRef : null, setCreateMode: setCreateMode })))));
};
exports.default = PollsList;
