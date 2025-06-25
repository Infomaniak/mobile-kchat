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
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/dialog/actions");
const BottomSheet_1 = __importDefault(require("../../../base/dialog/components/native/BottomSheet"));
const styles_1 = require("../../../base/dialog/components/native/styles");
const functions_1 = require("../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const styles_2 = __importDefault(require("./styles"));
const { AudioMode } = react_native_1.NativeModules;
/**
 * Maps each device type to a display name and icon.
 */
const deviceInfoMap = {
    BLUETOOTH: {
        icon: svg_1.IconBluetooth,
        text: 'audioDevices.bluetooth',
        type: 'BLUETOOTH'
    },
    CAR: {
        icon: svg_1.IconCar,
        text: 'audioDevices.car',
        type: 'CAR'
    },
    EARPIECE: {
        icon: svg_1.IconPhoneRinging,
        text: 'audioDevices.phone',
        type: 'EARPIECE'
    },
    HEADPHONES: {
        icon: svg_1.IconDeviceHeadphone,
        text: 'audioDevices.headphones',
        type: 'HEADPHONES'
    },
    SPEAKER: {
        icon: svg_1.IconVolumeUp,
        text: 'audioDevices.speaker',
        type: 'SPEAKER'
    }
};
/**
 * Implements a React {@code Component} which prompts the user when a password
 * is required to join a conference.
 */
class AudioRoutePickerDialog extends react_1.Component {
    /**
     * Implements React's {@link Component#getDerivedStateFromProps()}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props) {
        const { _devices: devices, t } = props;
        if (!devices) {
            return null;
        }
        const audioDevices = [];
        for (const device of devices) {
            const infoMap = deviceInfoMap[device.type];
            // Skip devices with unknown type.
            if (!infoMap) {
                // eslint-disable-next-line no-continue
                continue;
            }
            let text = t(infoMap.text);
            // iOS provides descriptive names for these, use it.
            if ((device.type === 'BLUETOOTH' || device.type === 'CAR') && device.name) {
                text = device.name;
            }
            if (infoMap) {
                const info = {
                    ...infoMap,
                    selected: Boolean(device.selected),
                    text,
                    uid: device.uid
                };
                audioDevices.push(info);
            }
        }
        // Make sure devices is alphabetically sorted.
        return {
            devices: lodash_1.default.sortBy(audioDevices, 'text')
        };
    }
    /**
     * Initializes a new {@code PasswordRequiredPrompt} instance.
     *
     * @param {IProps} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            /**
             * Available audio devices, it will be set in
             * {@link #getDerivedStateFromProps()}.
             */
            devices: []
        };
        // Trigger an initial update.
        AudioMode.updateDeviceList?.();
    }
    /**
     * Builds and returns a function which handles the selection of a device
     * on the sheet. The selected device will be used by {@code AudioMode}.
     *
     * @param {IDevice} device - Object representing the selected device.
     * @private
     * @returns {Function}
     */
    _onSelectDeviceFn(device) {
        return () => {
            this.props.dispatch((0, actions_1.hideSheet)());
            AudioMode.setAudioDevice(device.uid || device.type);
        };
    }
    /**
     * Renders a single device.
     *
     * @param {IDevice} device - Object representing a single device.
     * @private
     * @returns {ReactElement}
     */
    _renderDevice(device) {
        const { icon, selected, text } = device;
        const selectedStyle = selected ? styles_2.default.selectedText : {};
        const borderRadiusHighlightStyles = {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16
        };
        const speakerDeviceIsNotSelected = device.type !== 'SPEAKER';
        return (react_1.default.createElement(react_native_1.TouchableHighlight, { key: device.type, onPress: this._onSelectDeviceFn(device), style: speakerDeviceIsNotSelected && borderRadiusHighlightStyles, underlayColor: BaseTheme_native_1.default.palette.ui04 },
            react_1.default.createElement(react_native_1.View, { style: styles_2.default.deviceRow },
                react_1.default.createElement(Icon_1.default, { src: icon, style: [styles_2.default.deviceIcon, styles_1.bottomSheetStyles.buttons.iconStyle, selectedStyle
                    ] }),
                react_1.default.createElement(react_native_1.Text, { style: [styles_2.default.deviceText, styles_1.bottomSheetStyles.buttons.labelStyle, selectedStyle
                    ] }, text))));
    }
    /**
     * Renders a "fake" device row indicating there are no devices.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderNoDevices() {
        const { t } = this.props;
        return (react_1.default.createElement(react_native_1.View, { style: styles_2.default.deviceRow },
            react_1.default.createElement(Icon_1.default, { src: deviceInfoMap.SPEAKER.icon, style: [styles_2.default.deviceIcon, styles_1.bottomSheetStyles.buttons.iconStyle] }),
            react_1.default.createElement(react_native_1.Text, { style: [styles_2.default.deviceText, styles_1.bottomSheetStyles.buttons.labelStyle] }, t('audioDevices.none'))));
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { devices } = this.state;
        let content;
        if (devices.length === 0) {
            content = this._renderNoDevices();
        }
        else {
            content = this.state.devices.map(this._renderDevice, this);
        }
        return (react_1.default.createElement(BottomSheet_1.default, null, content));
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Object}
 */
function _mapStateToProps(state) {
    return {
        _devices: state['features/mobile/audio-mode'].devices
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(AudioRoutePickerDialog));
