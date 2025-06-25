"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const tss_react_1 = require("tss-react");
const mui_1 = require("tss-react/mui");
const SIZE = {
    small: 16,
    medium: 24,
    large: 48
};
const DEFAULT_COLOR = '#E6EDFA';
const useStyles = (0, mui_1.makeStyles)()((_, { color }) => {
    return {
        container: {
            verticalAlign: 'middle',
            opacity: 0,
            animation: `${(0, tss_react_1.keyframes) `
                0% {
                    transform: rotate(50deg);
                    opacity: 0;
                    stroke-dashoffset: 60;
                }
                100% {
                    transform: rotate(230deg);
                    opacity: 1;
                    stroke-dashoffset: 50;
                }
            `} 1s forwards ease-in-out`
        },
        circle: {
            fill: 'none',
            stroke: color,
            strokeWidth: 1.5,
            strokeLinecap: 'round',
            strokeDasharray: 60,
            strokeDashoffset: 'inherit',
            transformOrigin: 'center',
            animation: `${(0, tss_react_1.keyframes) `
                0% {
                    transform: rotate(0);
                }
                100% {
                    transform: rotate(360deg);
                }
            `} 0.86s forwards infinite`,
            animationDelay: '0ms',
            animationTimingFunction: 'cubic-bezier(0.4, 0.15, 0.6, 0.85)'
        }
    };
});
const Spinner = ({ color = DEFAULT_COLOR, size = 'medium' }) => {
    const { classes } = useStyles({ color });
    return (react_1.default.createElement("svg", { className: classes.container, focusable: 'false', height: SIZE[size], viewBox: '0 0 16 16', width: SIZE[size], xmlns: 'http://www.w3.org/2000/svg' },
        react_1.default.createElement("circle", { className: classes.circle, cx: '8', cy: '8', r: '7' })));
};
exports.default = Spinner;
