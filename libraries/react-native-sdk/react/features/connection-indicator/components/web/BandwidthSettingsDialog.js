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
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
// @ts-ignore
const constants_1 = require("../../../../../modules/API/constants");
const actions_1 = require("../../../base/conference/actions");
const svg_1 = require("../../../base/icons/svg");
const functions_web_1 = require("../../../base/styles/functions.web");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
const Input_1 = __importDefault(require("../../../base/ui/components/web/Input"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        content: {
            color: theme.palette.text01
        },
        info: {
            background: theme.palette.ui01,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelRegular),
            color: theme.palette.text02,
            marginTop: theme.spacing(2)
        },
        possibleValues: {
            margin: 0,
            paddingLeft: theme.spacing(4)
        }
    };
});
/**
 * Bandwidth settings dialog component.
 *
 * @returns {ReactElement}
 */
const BandwidthSettingsDialog = () => {
    const { classes } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const [showAssumedBandwidthInfo, setShowAssumedBandwidthInfo] = (0, react_1.useState)(false);
    const currentAssumedBandwidthBps = (0, react_redux_1.useSelector)((state) => state['features/base/conference'].assumedBandwidthBps);
    const [assumedBandwidthBps, setAssumedBandwidthBps] = (0, react_1.useState)(currentAssumedBandwidthBps === constants_1.MIN_ASSUMED_BANDWIDTH_BPS
        || currentAssumedBandwidthBps === undefined
        ? ''
        : currentAssumedBandwidthBps);
    /**
     * Changes the assumed bandwidth bps.
     *
     * @param {string} value - The key event to handle.
     *
     * @returns {void}
     */
    const onAssumedBandwidthBpsChange = (0, react_1.useCallback)((value) => {
        setAssumedBandwidthBps(value);
    }, [setAssumedBandwidthBps]);
    /**
     * Persists the assumed bandwidth bps.
     *
     * @param {string} value - The key event to handle.
     *
     * @returns {void}
     */
    const onAssumedBandwidthBpsSave = (0, react_1.useCallback)(() => {
        if (assumedBandwidthBps !== currentAssumedBandwidthBps) {
            dispatch((0, actions_1.setAssumedBandwidthBps)(Number(assumedBandwidthBps === '' ? constants_1.MIN_ASSUMED_BANDWIDTH_BPS : assumedBandwidthBps)));
        }
    }, [assumedBandwidthBps, currentAssumedBandwidthBps, dispatch, actions_1.setAssumedBandwidthBps]);
    /**
     * Validates the assumed bandwidth bps.
     *
     * @param {KeyboardEvent<any>} e - The key event to handle.
     *
     * @returns {void}
     */
    const onAssumedBandwidthBpsKeyPress = (0, react_1.useCallback)((e) => {
        const isValid = (e.charCode !== 8 && e.charCode === 0) || (e.charCode >= 48 && e.charCode <= 57);
        if (!isValid) {
            e.preventDefault();
        }
    }, []);
    /**
     * Callback invoked to hide or show the possible values
     * of the assumed bandwidth setting.
     *
     * @returns {void}
     */
    const toggleInfoPanel = (0, react_1.useCallback)(() => {
        setShowAssumedBandwidthInfo(!showAssumedBandwidthInfo);
    }, [setShowAssumedBandwidthInfo, showAssumedBandwidthInfo]);
    return (react_1.default.createElement(Dialog_1.default, { onSubmit: onAssumedBandwidthBpsSave, titleKey: 'bandwidthSettings.title' },
        react_1.default.createElement("div", { className: classes.content },
            react_1.default.createElement(Input_1.default, { bottomLabel: t('bandwidthSettings.assumedBandwidthBpsWarning'), icon: svg_1.IconInfoCircle, iconClick: toggleInfoPanel, id: 'setAssumedBandwidthBps', label: t('bandwidthSettings.setAssumedBandwidthBps'), minValue: 0, name: 'assumedBandwidthBps', onChange: onAssumedBandwidthBpsChange, onKeyPress: onAssumedBandwidthBpsKeyPress, placeholder: t('bandwidthSettings.assumedBandwidthBps'), type: 'number', value: assumedBandwidthBps }),
            showAssumedBandwidthInfo && (react_1.default.createElement("div", { className: classes.info },
                react_1.default.createElement("span", null,
                    t('bandwidthSettings.possibleValues'),
                    ":"),
                react_1.default.createElement("ul", { className: classes.possibleValues },
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("b", null, t('bandwidthSettings.leaveEmpty')),
                        " ",
                        t('bandwidthSettings.leaveEmptyEffect')),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("b", null, "0"),
                        " ",
                        t('bandwidthSettings.zeroEffect')),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("b", null, t('bandwidthSettings.customValue')),
                        " ",
                        t('bandwidthSettings.customValueEffect'))))))));
};
exports.default = BandwidthSettingsDialog;
