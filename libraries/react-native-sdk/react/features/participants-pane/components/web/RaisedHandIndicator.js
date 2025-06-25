"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaisedHandIndicator = void 0;
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        indicator: {
            backgroundColor: theme.palette.warning02,
            borderRadius: `${Number(theme.shape.borderRadius) / 2}px`,
            height: '24px',
            width: '24px'
        }
    };
});
const RaisedHandIndicator = () => {
    const { classes: styles, theme } = useStyles();
    return (react_1.default.createElement("div", { className: styles.indicator },
        react_1.default.createElement(Icon_1.default, { color: theme.palette.icon04, size: 16, src: svg_1.IconRaiseHand })));
};
exports.RaisedHandIndicator = RaisedHandIndicator;
