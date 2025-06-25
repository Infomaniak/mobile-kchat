"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const mui_1 = require("tss-react/mui");
const TimelineAxis_1 = __importDefault(require("./TimelineAxis"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        labels: {
            padding: '22px 0 7px 0',
            height: 20,
            '& .avatar-placeholder': {
                width: '32px',
                marginRight: theme.spacing(3)
            }
        }
    };
});
const SpeakerStatsLabels = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { classes } = useStyles();
    const nameTimeClass = `name-time${props.showFaceExpressions ? ' expressions-on' : ''}`;
    return (react_1.default.createElement("div", { className: `row ${classes.labels}` },
        react_1.default.createElement("div", { className: 'avatar-placeholder' }),
        react_1.default.createElement("div", { className: nameTimeClass },
            react_1.default.createElement("div", null, t('speakerStats.name')),
            react_1.default.createElement("div", null, t('speakerStats.speakerTime'))),
        props.showFaceExpressions && react_1.default.createElement(TimelineAxis_1.default, null)));
};
exports.default = SpeakerStatsLabels;
