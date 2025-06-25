"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    // keep the same height for all elements:
    // input, input track & fake track(div)
    const height = 6;
    const inputTrack = {
        background: 'transparent',
        height
    };
    const inputThumb = {
        background: theme.palette.text01,
        border: 0,
        borderRadius: '50%',
        height: 24,
        width: 24
    };
    const focused = {
        outline: `1px solid ${theme.palette.ui06}`
    };
    return {
        sliderContainer: {
            cursor: 'pointer',
            width: '100%',
            position: 'relative',
            textAlign: 'center'
        },
        knobContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: 2,
            marginRight: 2,
            position: 'absolute',
            width: '100%'
        },
        knob: {
            background: theme.palette.text01,
            borderRadius: '50%',
            display: 'inline-block',
            height,
            width: 6
        },
        track: {
            background: theme.palette.text03,
            borderRadius: Number(theme.shape.borderRadius) / 2,
            height
        },
        slider: {
            // Use an additional class here to override global CSS specificity
            '&.custom-slider': {
                '-webkit-appearance': 'none',
                background: 'transparent',
                height,
                left: 0,
                position: 'absolute',
                top: 0,
                width: '100%',
                '&.focus-visible': {
                    // override global styles in order to use our own color
                    outline: 'none !important',
                    '&::-webkit-slider-runnable-track': focused,
                    '&::ms-track': focused,
                    '&::-moz-range-track': focused
                },
                '&::-webkit-slider-runnable-track': {
                    '-webkit-appearance': 'none',
                    ...inputTrack
                },
                '&::-webkit-slider-thumb': {
                    '-webkit-appearance': 'none',
                    position: 'relative',
                    top: -6,
                    ...inputThumb
                },
                '&::ms-track': {
                    ...inputTrack
                },
                '&::-ms-thumb': {
                    ...inputThumb
                },
                '&::-moz-range-track': {
                    ...inputTrack
                },
                '&::-moz-range-thumb': {
                    ...inputThumb
                }
            }
        }
    };
});
/**
 *  Custom slider.
 *
 *  @returns {ReactElement}
 */
function Slider({ ariaLabel, max, min, onChange, step, value }) {
    const { classes, cx } = useStyles();
    const knobs = [...Array(Math.floor((max - min) / step) + 1)];
    return (react_1.default.createElement("div", { className: classes.sliderContainer },
        react_1.default.createElement("ul", { "aria-hidden": true, className: cx('empty-list', classes.knobContainer) }, knobs.map((_, i) => (react_1.default.createElement("li", { className: classes.knob, key: `knob-${i}` })))),
        react_1.default.createElement("div", { className: classes.track }),
        react_1.default.createElement("input", { "aria-label": ariaLabel, className: cx(classes.slider, 'custom-slider'), max: max, min: min, onChange: onChange, step: step, type: 'range', value: value })));
}
exports.default = Slider;
