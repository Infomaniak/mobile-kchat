"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../../base/styles/functions.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            display: 'flex',
            padding: '10px',
            alignItems: 'center',
            backgroundColor: theme.palette.action03,
            '&:hover': {
                backgroundColor: theme.palette.action03Hover
            }
        },
        flag: {
            marginRight: theme.spacing(2)
        },
        text: {
            color: theme.palette.text01,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
    };
});
const CountryRow = ({ country, onEntryClick }) => {
    const { classes, cx } = useStyles();
    const _onClick = () => {
        onEntryClick(country);
    };
    return (react_1.default.createElement("div", { className: classes.container, 
        // eslint-disable-next-line react/jsx-no-bind
        onClick: _onClick },
        react_1.default.createElement("div", { className: cx(classes.flag, 'iti-flag', country.code) }),
        react_1.default.createElement("div", { className: classes.text }, `${country.name} (+${country.dialCode})`)));
};
exports.default = CountryRow;
