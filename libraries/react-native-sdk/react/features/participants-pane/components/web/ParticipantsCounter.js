"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../base/participants/functions");
const functions_web_1 = require("../../../base/styles/functions.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        badge: {
            backgroundColor: theme.palette.ui03,
            borderRadius: '100%',
            height: '16px',
            minWidth: '16px',
            color: theme.palette.text01,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelBold),
            pointerEvents: 'none',
            position: 'absolute',
            right: '-4px',
            top: '-3px',
            textAlign: 'center',
            padding: '1px'
        }
    };
});
const ParticipantsCounter = () => {
    const { classes } = useStyles();
    const participantsCount = (0, react_redux_1.useSelector)(functions_1.getParticipantCount);
    return react_1.default.createElement("span", { className: classes.badge }, participantsCount);
};
exports.default = ParticipantsCounter;
