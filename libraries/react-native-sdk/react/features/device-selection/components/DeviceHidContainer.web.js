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
const Icon_1 = __importDefault(require("../../base/icons/components/Icon"));
const svg_1 = require("../../base/icons/svg");
const functions_web_1 = require("../../base/styles/functions.web");
const Button_1 = __importDefault(require("../../base/ui/components/web/Button"));
const constants_any_1 = require("../../base/ui/constants.any");
const actions_1 = require("../../web-hid/actions");
const functions_1 = require("../../web-hid/functions");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        callControlContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
        },
        label: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            color: theme.palette.text01,
            marginBottom: theme.spacing(2)
        },
        deviceRow: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        deleteDevice: {
            cursor: 'pointer',
            textAlign: 'center'
        },
        headerConnectedDevice: {
            fontWeight: 600
        },
        hidContainer: {
            '> span': {
                marginLeft: '16px'
            }
        }
    };
});
/**
 * Device hid container.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactElement}
 */
function DeviceHidContainer() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const deviceInfo = (0, react_redux_1.useSelector)(functions_1.getDeviceInfo);
    const showRequestDeviceInfo = (0, functions_1.shouldRequestHIDDevice)(deviceInfo);
    const { classes } = useStyles();
    const dispatch = (0, react_redux_1.useDispatch)();
    const onRequestControl = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.requestHidDevice)());
    }, [dispatch]);
    const onDeleteHid = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.closeHidDevice)());
    }, [dispatch]);
    return (react_1.default.createElement("div", { className: classes.callControlContainer, key: 'callControl' },
        react_1.default.createElement("label", { className: classes.label, htmlFor: 'callControl' }, t('deviceSelection.hid.callControl')),
        showRequestDeviceInfo && (react_1.default.createElement(Button_1.default, { accessibilityLabel: t('deviceSelection.hid.pairDevice'), id: 'request-control-btn', key: 'request-control-btn', label: t('deviceSelection.hid.pairDevice'), onClick: onRequestControl, type: constants_any_1.BUTTON_TYPES.SECONDARY })),
        !showRequestDeviceInfo && (react_1.default.createElement("div", { className: classes.hidContainer },
            react_1.default.createElement("p", { className: classes.headerConnectedDevice }, t('deviceSelection.hid.connectedDevices')),
            react_1.default.createElement("div", { className: classes.deviceRow },
                react_1.default.createElement("span", null, deviceInfo.device?.productName),
                react_1.default.createElement(Icon_1.default, { ariaLabel: t('deviceSelection.hid.deleteDevice'), className: classes.deleteDevice, onClick: onDeleteHid, role: 'button', src: svg_1.IconTrash, tabIndex: 0 }))))));
}
exports.default = DeviceHidContainer;
