"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../base/styles/functions.web");
const constants_1 = require("../../constants");
const AbstractSpeakerStatsList_1 = __importDefault(require("../AbstractSpeakerStatsList"));
const SpeakerStatsItem_1 = __importDefault(require("./SpeakerStatsItem"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        list: {
            paddingTop: 90,
            '& .item': {
                height: theme.spacing(7),
                [theme.breakpoints.down(constants_1.MOBILE_BREAKPOINT)]: {
                    height: theme.spacing(8)
                },
                '& .has-left': {
                    color: theme.palette.text03
                },
                '& .avatar': {
                    marginRight: theme.spacing(3)
                },
                '& .time': {
                    padding: '2px 4px',
                    borderRadius: '4px',
                    ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelBold),
                    [theme.breakpoints.down(constants_1.MOBILE_BREAKPOINT)]: {
                        ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegularLarge)
                    },
                    backgroundColor: theme.palette.ui02
                },
                '& .display-name': {
                    ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
                    [theme.breakpoints.down(constants_1.MOBILE_BREAKPOINT)]: {
                        ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegularLarge)
                    }
                },
                '& .dominant': {
                    backgroundColor: theme.palette.success02
                }
            }
        }
    };
});
/**
 * Component that renders the list of speaker stats.
 *
 * @returns {React$Element<any>}
 */
const SpeakerStatsList = () => {
    const { classes } = useStyles();
    const items = (0, AbstractSpeakerStatsList_1.default)(SpeakerStatsItem_1.default);
    return (react_1.default.createElement("div", { className: classes.list },
        react_1.default.createElement("div", { className: 'separator' }),
        items));
};
exports.default = SpeakerStatsList;
