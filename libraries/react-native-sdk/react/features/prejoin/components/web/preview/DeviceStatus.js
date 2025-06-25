"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../../base/i18n/functions");
const functions_web_1 = require("../../../../base/styles/functions.web");
const functions_2 = require("../../../functions");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        deviceStatus: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            color: '#fff',
            marginTop: theme.spacing(4),
            '& span': {
                marginLeft: theme.spacing(3)
            },
            '&.device-status-error': {
                alignItems: 'flex-start',
                backgroundColor: theme.palette.warning01,
                borderRadius: '6px',
                color: theme.palette.uiBackground,
                padding: '12px 16px',
                textAlign: 'left',
                marginTop: theme.spacing(2)
            },
            '@media (max-width: 720px)': {
                marginTop: 0
            }
        },
        indicator: {
            width: '16px',
            height: '16px',
            borderRadius: '100%',
            backgroundColor: theme.palette.success01
        }
    };
});
/**
 * Strip showing the current status of the devices.
 * User is informed if there are missing or malfunctioning devices.
 *
 * @returns {ReactElement}
 */
function DeviceStatus({ deviceStatusType, deviceStatusText, t }) {
    const { classes, cx } = useStyles();
    const hasError = deviceStatusType === 'warning';
    const containerClassName = cx(classes.deviceStatus, { 'device-status-error': hasError });
    return (react_1.default.createElement("div", { className: containerClassName, role: 'alert', tabIndex: -1 },
        !hasError && react_1.default.createElement("div", { className: classes.indicator }),
        react_1.default.createElement("span", { role: 'heading' }, hasError ? t('prejoin.errorNoPermissions') : t(deviceStatusText ?? ''))));
}
/**
 * Maps (parts of) the redux state to the React {@code Component} props.
 *
 * @param {Object} state - The redux state.
 * @returns {{ deviceStatusText: string, deviceStatusText: string }}
 */
function mapStateToProps(state) {
    return {
        deviceStatusText: (0, functions_2.getDeviceStatusText)(state),
        deviceStatusType: (0, functions_2.getDeviceStatusType)(state)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(mapStateToProps)(DeviceStatus));
