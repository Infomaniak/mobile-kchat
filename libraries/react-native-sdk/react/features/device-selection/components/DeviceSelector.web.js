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
const functions_web_1 = require("../../base/styles/functions.web");
const Select_1 = __importDefault(require("../../base/ui/components/web/Select"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        textSelector: {
            width: '100%',
            boxSizing: 'border-box',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.uiBackground,
            padding: '10px 16px',
            textAlign: 'center',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            border: `1px solid ${theme.palette.ui03}`
        }
    };
});
const DeviceSelector = ({ devices, hasPermission, id, isDisabled, label, onSelect, selectedDeviceId }) => {
    const { classes } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    const _onSelect = (0, react_1.useCallback)((e) => {
        const deviceId = e.target.value;
        if (selectedDeviceId !== deviceId) {
            onSelect(deviceId);
        }
    }, [selectedDeviceId, onSelect]);
    const _createDropdown = (options) => {
        const triggerText = (options.defaultSelected && (options.defaultSelected.label || options.defaultSelected.deviceId))
            || options.placeholder;
        if (options.isDisabled || !options.items?.length) {
            return (react_1.default.createElement("div", { className: classes.textSelector }, triggerText));
        }
        return (react_1.default.createElement(Select_1.default, { id: id, label: t(label), onChange: _onSelect, options: options.items, value: selectedDeviceId }));
    };
    const _renderNoDevices = () => _createDropdown({
        isDisabled: true,
        placeholder: t('settings.noDevice')
    });
    const _renderNoPermission = () => _createDropdown({
        isDisabled: true,
        placeholder: t('deviceSelection.noPermission')
    });
    if (hasPermission === undefined) {
        return null;
    }
    if (!hasPermission) {
        return _renderNoPermission();
    }
    if (!devices?.length) {
        return _renderNoDevices();
    }
    const items = devices.map(device => {
        return {
            value: device.deviceId,
            label: device.label || device.deviceId
        };
    });
    const defaultSelected = devices.find(item => item.deviceId === selectedDeviceId);
    return _createDropdown({
        defaultSelected,
        isDisabled,
        items,
        placeholder: t('deviceSelection.selectADevice')
    });
};
exports.default = DeviceSelector;
