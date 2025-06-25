"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../styles/functions.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        warning: {
            bottom: 0,
            color: theme.palette.text03,
            display: 'flex',
            justifyContent: 'center',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            marginBottom: theme.spacing(3),
            marginTop: theme.spacing(2),
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            position: 'absolute',
            width: '100%',
            '@media (max-width: 720px)': {
                position: 'relative'
            }
        }
    };
});
const RecordingWarning = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { classes } = useStyles();
    return (react_1.default.createElement("div", { className: classes.warning }, t('prejoin.recordingWarning')));
};
exports.default = RecordingWarning;
