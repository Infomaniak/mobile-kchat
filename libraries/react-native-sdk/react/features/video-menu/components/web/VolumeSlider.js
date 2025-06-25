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
const mui_1 = require("tss-react/mui");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const constants_1 = require("../../constants");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            minHeight: '40px',
            minWidth: '180px',
            width: '100%',
            boxSizing: 'border-box',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '10px 16px',
            '&:hover': {
                backgroundColor: theme.palette.ui02
            }
        },
        icon: {
            minWidth: '20px',
            marginRight: '16px',
            position: 'relative'
        },
        sliderContainer: {
            position: 'relative',
            width: '100%'
        },
        slider: {
            position: 'absolute',
            width: '100%',
            top: '50%',
            transform: 'translate(0, -50%)'
        }
    };
});
const _onClick = (e) => {
    e.stopPropagation();
};
const VolumeSlider = ({ initialValue, onChange }) => {
    const { classes, cx } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [volumeLevel, setVolumeLevel] = (0, react_1.useState)((initialValue || 0) * constants_1.VOLUME_SLIDER_SCALE);
    const _onVolumeChange = (0, react_1.useCallback)((event) => {
        const newVolumeLevel = Number(event.currentTarget.value);
        onChange(newVolumeLevel / constants_1.VOLUME_SLIDER_SCALE);
        setVolumeLevel(newVolumeLevel);
    }, [onChange]);
    return (react_1.default.createElement("div", { "aria-label": t('volumeSlider'), className: cx('popupmenu__contents', classes.container), onClick: _onClick },
        react_1.default.createElement("span", { className: classes.icon },
            react_1.default.createElement(Icon_1.default, { size: 22, src: svg_1.IconVolumeUp })),
        react_1.default.createElement("div", { className: classes.sliderContainer },
            react_1.default.createElement("input", { "aria-valuemax": constants_1.VOLUME_SLIDER_SCALE, "aria-valuemin": 0, "aria-valuenow": volumeLevel, className: cx('popupmenu__volume-slider', classes.slider), max: constants_1.VOLUME_SLIDER_SCALE, min: 0, onChange: _onVolumeChange, tabIndex: 0, type: 'range', value: volumeLevel }))));
};
exports.default = VolumeSlider;
