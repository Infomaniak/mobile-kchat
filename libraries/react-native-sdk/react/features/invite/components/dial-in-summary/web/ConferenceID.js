"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../../base/i18n/functions");
const functions_web_1 = require("../../../../base/styles/functions.web");
const _utils_1 = require("../../../_utils");
const useStyles = (0, mui_1.makeStyles)()((theme) => {
    return {
        container: {
            marginTop: 32,
            maxWidth: 310,
            padding: '16px 12px',
            background: theme.palette.ui02,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 6,
            '& *': {
                userSelect: 'text'
            }
        },
        confNameLabel: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.heading6),
            marginBottom: 18,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        descriptionLabel: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegularLarge),
            marginBottom: 18
        },
        separator: {
            width: '100%',
            height: 1,
            background: theme.palette.ui04,
            marginBottom: 18
        },
        pinLabel: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.heading6)
        }
    };
});
const ConferenceID = ({ conferenceID, t }) => {
    const { classes: styles } = useStyles();
    return (react_1.default.createElement("div", { className: styles.container },
        react_1.default.createElement("div", { className: styles.descriptionLabel }, t('info.dialANumber')),
        react_1.default.createElement("div", { className: styles.separator }),
        react_1.default.createElement("div", { className: styles.pinLabel }, `${t('info.dialInConferenceID')} ${(0, _utils_1._formatConferenceIDPin)(conferenceID ?? '')}`)));
};
exports.default = (0, functions_1.translate)(ConferenceID);
