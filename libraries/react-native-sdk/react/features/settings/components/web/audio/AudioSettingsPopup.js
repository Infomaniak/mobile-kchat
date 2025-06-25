"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../../base/config/functions.web");
const actions_web_1 = require("../../../../base/devices/actions.web");
const functions_web_2 = require("../../../../base/devices/functions.web");
const Popover_web_1 = __importDefault(require("../../../../base/popover/components/Popover.web"));
const constants_1 = require("../../../../base/responsive-ui/constants");
const functions_web_3 = require("../../../../base/settings/functions.web");
const actions_1 = require("../../../actions");
const functions_web_4 = require("../../../functions.web");
const AudioSettingsContent_1 = __importDefault(require("./AudioSettingsContent"));
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        container: {
            display: 'inline-block'
        }
    };
});
/**
 * Popup with audio settings.
 *
 * @returns {ReactElement}
 */
function AudioSettingsPopup({ children, currentMicDeviceId, currentOutputDeviceId, isOpen, microphoneDevices, setAudioInputDevice, setAudioOutputDevice, onClose, outputDevices, popupPlacement, measureAudioLevels }) {
    const { classes, cx } = useStyles();
    return (react_1.default.createElement("div", { className: cx(classes.container, 'audio-preview') },
        react_1.default.createElement(Popover_web_1.default, { allowClick: true, content: react_1.default.createElement(AudioSettingsContent_1.default, { currentMicDeviceId: currentMicDeviceId, currentOutputDeviceId: currentOutputDeviceId, measureAudioLevels: measureAudioLevels, microphoneDevices: microphoneDevices, outputDevices: outputDevices, setAudioInputDevice: setAudioInputDevice, setAudioOutputDevice: setAudioOutputDevice }), headingId: 'audio-settings-button', onPopoverClose: onClose, position: popupPlacement, trigger: 'click', visible: isOpen }, children)));
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
function mapStateToProps(state) {
    const { clientWidth } = state['features/base/responsive-ui'];
    return {
        popupPlacement: clientWidth <= Number(constants_1.SMALL_MOBILE_WIDTH) ? 'auto' : 'top-end',
        currentMicDeviceId: (0, functions_web_3.getCurrentMicDeviceId)(state),
        currentOutputDeviceId: (0, functions_web_3.getCurrentOutputDeviceId)(state),
        isOpen: Boolean((0, functions_web_4.getAudioSettingsVisibility)(state)),
        microphoneDevices: (0, functions_web_2.getAudioInputDeviceData)(state) ?? [],
        outputDevices: (0, functions_web_2.getAudioOutputDeviceData)(state) ?? [],
        measureAudioLevels: (0, functions_web_1.areAudioLevelsEnabled)(state)
    };
}
const mapDispatchToProps = {
    onClose: actions_1.toggleAudioSettings,
    setAudioInputDevice: actions_web_1.setAudioInputDeviceAndUpdateSettings,
    setAudioOutputDevice: actions_web_1.setAudioOutputDevice
};
exports.default = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(AudioSettingsPopup);
