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
/* eslint-disable react/no-multi-comp */
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const svg_1 = require("../../../../base/icons/svg");
const lib_jitsi_meet_1 = __importDefault(require("../../../../base/lib-jitsi-meet"));
const functions_1 = require("../../../../base/redux/functions");
const Checkbox_1 = __importDefault(require("../../../../base/ui/components/web/Checkbox"));
const ContextMenu_1 = __importDefault(require("../../../../base/ui/components/web/ContextMenu"));
const ContextMenuItem_1 = __importDefault(require("../../../../base/ui/components/web/ContextMenuItem"));
const ContextMenuItemGroup_1 = __importDefault(require("../../../../base/ui/components/web/ContextMenuItemGroup"));
const actions_1 = require("../../../../noise-suppression/actions");
const functions_2 = require("../../../../noise-suppression/functions");
const functions_3 = require("../../../../prejoin/functions");
const functions_web_1 = require("../../../functions.web");
const MicrophoneEntry_1 = __importDefault(require("./MicrophoneEntry"));
const SpeakerEntry_1 = __importDefault(require("./SpeakerEntry"));
const browser = lib_jitsi_meet_1.default.util.browser;
/**
 * Translates the default device label into a more user friendly one.
 *
 * @param {string} deviceId - The device Id.
 * @param {string} label - The device label.
 * @param {Function} t - The translation function.
 * @returns {string}
 */
function transformDefaultDeviceLabel(deviceId, label, t) {
    return deviceId === 'default'
        ? t('settings.sameAsSystem', { label: label.replace('Default - ', '') })
        : label;
}
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        contextMenu: {
            position: 'relative',
            right: 'auto',
            margin: 0,
            marginBottom: theme.spacing(1),
            maxHeight: 'calc(100dvh - 100px)',
            overflow: 'auto',
            width: '300px'
        },
        header: {
            '&:hover': {
                backgroundColor: 'initial',
                cursor: 'initial'
            }
        },
        list: {
            margin: 0,
            padding: 0,
            listStyleType: 'none'
        },
        checkboxContainer: {
            padding: '10px 16px'
        }
    };
});
const AudioSettingsContent = ({ currentMicDeviceId, currentOutputDeviceId, measureAudioLevels, microphoneDevices, noiseSuppressionEnabled, outputDevices, prejoinVisible, setAudioInputDevice, setAudioOutputDevice, toggleSuppression }) => {
    const _componentWasUnmounted = (0, react_1.useRef)(false);
    const microphoneHeaderId = 'microphone_settings_header';
    const speakerHeaderId = 'speaker_settings_header';
    const { classes } = useStyles();
    const [audioTracks, setAudioTracks] = (0, react_1.useState)(microphoneDevices.map(({ deviceId, label }) => {
        return {
            deviceId,
            hasError: false,
            jitsiTrack: null,
            label
        };
    }));
    const microphoneDevicesRef = (0, react_1.useRef)(microphoneDevices);
    const { t } = (0, react_i18next_1.useTranslation)();
    /**
     * Click handler for the microphone entries.
     *
     * @param {string} deviceId - The deviceId for the clicked microphone.
     * @returns {void}
     */
    const _onMicrophoneEntryClick = (0, react_1.useCallback)((deviceId) => {
        setAudioInputDevice(deviceId);
    }, [setAudioInputDevice]);
    /**
     * Click handler for the speaker entries.
     *
     * @param {string} deviceId - The deviceId for the clicked speaker.
     * @returns {void}
     */
    const _onSpeakerEntryClick = (0, react_1.useCallback)((deviceId) => {
        setAudioOutputDevice(deviceId);
    }, [setAudioOutputDevice]);
    /**
     * Renders a single microphone entry.
     *
     * @param {Object} data - An object with the deviceId, jitsiTrack & label of the microphone.
     * @param {number} index - The index of the element, used for creating a key.
     * @param {length} length - The length of the microphone list.
     * @returns {React$Node}
     */
    const _renderMicrophoneEntry = (data, index, length) => {
        const { deviceId, jitsiTrack, hasError } = data;
        const label = transformDefaultDeviceLabel(deviceId, data.label, t);
        const isSelected = deviceId === currentMicDeviceId;
        return (react_1.default.createElement(MicrophoneEntry_1.default, { deviceId: deviceId, hasError: hasError, index: index, isSelected: isSelected, jitsiTrack: jitsiTrack, key: `me-${index}`, length: length, measureAudioLevels: measureAudioLevels, onClick: _onMicrophoneEntryClick }, label));
    };
    /**
     * Renders a single speaker entry.
     *
     * @param {Object} data - An object with the deviceId and label of the speaker.
     * @param {number} index - The index of the element, used for creating a key.
     * @param {length} length - The length of the speaker list.
     * @returns {React$Node}
     */
    const _renderSpeakerEntry = (data, index, length) => {
        const { deviceId } = data;
        const label = transformDefaultDeviceLabel(deviceId, data.label, t);
        const key = `se-${index}`;
        const isSelected = deviceId === currentOutputDeviceId;
        return (react_1.default.createElement(SpeakerEntry_1.default, { deviceId: deviceId, index: index, isSelected: isSelected, key: key, length: length, onClick: _onSpeakerEntryClick }, label));
    };
    /**
     * Disposes the audio tracks.
     *
     * @param {Object} tracks - The object holding the audio tracks.
     * @returns {void}
     */
    const _disposeTracks = (tracks) => {
        tracks.forEach(({ jitsiTrack }) => {
            jitsiTrack?.dispose();
        });
    };
    /**
     * Creates and updates the audio tracks.
     *
     * @returns {void}
     */
    const _setTracks = async () => {
        if (browser.isWebKitBased()) {
            // It appears that at the time of this writing, creating audio tracks blocks the browser's main thread for
            // long time on safari. Wasn't able to confirm which part of track creation does the blocking exactly, but
            // not creating the tracks seems to help and makes the UI much more responsive.
            return;
        }
        _disposeTracks(audioTracks);
        const newAudioTracks = await (0, functions_web_1.createLocalAudioTracks)(microphoneDevices, 5000);
        if (_componentWasUnmounted.current) {
            _disposeTracks(newAudioTracks);
        }
        else {
            setAudioTracks(newAudioTracks);
        }
    };
    (0, react_1.useEffect)(() => {
        _setTracks();
        return () => {
            _componentWasUnmounted.current = true;
            _disposeTracks(audioTracks);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!(0, functions_1.equals)(microphoneDevices, microphoneDevicesRef.current)) {
            _setTracks();
            microphoneDevicesRef.current = microphoneDevices;
        }
    }, [microphoneDevices]);
    return (react_1.default.createElement(ContextMenu_1.default, { "aria-labelledby": 'audio-settings-button', className: classes.contextMenu, hidden: false, id: 'audio-settings-dialog', tabIndex: -1 },
        react_1.default.createElement(ContextMenuItemGroup_1.default, null,
            react_1.default.createElement(ContextMenuItem_1.default, { accessibilityLabel: t('settings.microphones'), className: classes.header, icon: svg_1.IconMic, id: microphoneHeaderId, text: t('settings.microphones') }),
            react_1.default.createElement("ul", { "aria-labelledby": microphoneHeaderId, className: classes.list, role: 'radiogroup', tabIndex: -1 }, audioTracks.map((data, i) => _renderMicrophoneEntry(data, i, audioTracks.length)))),
        outputDevices.length > 0 && (react_1.default.createElement(ContextMenuItemGroup_1.default, null,
            react_1.default.createElement(ContextMenuItem_1.default, { accessibilityLabel: t('settings.speakers'), className: classes.header, icon: svg_1.IconVolumeUp, id: speakerHeaderId, text: t('settings.speakers') }),
            react_1.default.createElement("ul", { "aria-labelledby": speakerHeaderId, className: classes.list, role: 'radiogroup', tabIndex: -1 }, outputDevices.map((data, i) => _renderSpeakerEntry(data, i, outputDevices.length))))),
        !prejoinVisible && (react_1.default.createElement(ContextMenuItemGroup_1.default, null,
            react_1.default.createElement("div", { className: classes.checkboxContainer, 
                // eslint-disable-next-line react/jsx-no-bind
                onClick: e => e.stopPropagation() },
                react_1.default.createElement(Checkbox_1.default, { checked: noiseSuppressionEnabled, label: t('toolbar.noiseSuppression'), onChange: toggleSuppression }))))));
};
const mapStateToProps = (state) => {
    return {
        noiseSuppressionEnabled: (0, functions_2.isNoiseSuppressionEnabled)(state),
        prejoinVisible: (0, functions_3.isPrejoinPageVisible)(state)
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        toggleSuppression() {
            dispatch((0, actions_1.toggleNoiseSuppression)());
        }
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(AudioSettingsContent);
