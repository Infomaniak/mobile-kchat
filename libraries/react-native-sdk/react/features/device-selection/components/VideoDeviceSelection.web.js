"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const actions_web_1 = require("../../base/devices/actions.web");
const AbstractDialogTab_1 = __importDefault(require("../../base/dialog/components/web/AbstractDialogTab"));
const functions_1 = require("../../base/i18n/functions");
const functions_web_1 = require("../../base/lib-jitsi-meet/functions.web");
const Checkbox_1 = __importDefault(require("../../base/ui/components/web/Checkbox"));
const Select_1 = __importDefault(require("../../base/ui/components/web/Select"));
const constants_1 = require("../../settings/constants");
const logger_1 = __importDefault(require("../logger"));
const DeviceSelector_web_1 = __importDefault(require("./DeviceSelector.web"));
const VideoInputPreview_1 = __importDefault(require("./VideoInputPreview"));
const styles = (theme) => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'column',
            padding: '0 2px',
            width: '100%'
        },
        checkboxContainer: {
            margin: `${theme.spacing(4)} 0`
        }
    };
};
/**
 * React {@code Component} for previewing audio and video input/output devices.
 *
 * @augments Component
 */
class VideoDeviceSelection extends AbstractDialogTab_1.default {
    /**
     * Initializes a new DeviceSelection instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            previewVideoTrack: null,
            previewVideoTrackError: null
        };
        this._unMounted = true;
        this._onFramerateItemSelect = this._onFramerateItemSelect.bind(this);
    }
    /**
     * Generate the initial previews for audio input and video input.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._unMounted = false;
        Promise.all([
            this._createVideoInputTrack(this.props.selectedVideoInputId)
        ])
            .catch(err => logger_1.default.warn('Failed to initialize preview tracks', err))
            .then(() => {
            this.props.dispatch((0, actions_web_1.getAvailableDevices)());
        });
    }
    /**
     * Checks if audio / video permissions were granted. Updates audio input and
     * video input previews.
     *
     * @param {Object} prevProps - Previous props this component received.
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        if (prevProps.selectedVideoInputId
            !== this.props.selectedVideoInputId) {
            this._createVideoInputTrack(this.props.selectedVideoInputId);
        }
    }
    /**
     * Ensure preview tracks are destroyed to prevent continued use.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this._unMounted = true;
        this._disposeVideoInputPreview();
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { hideAdditionalSettings, hideVideoInputPreview, localFlipX, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement("div", { className: classes.container },
            !hideVideoInputPreview
                && react_1.default.createElement(VideoInputPreview_1.default, { error: this.state.previewVideoTrackError, localFlipX: localFlipX, track: this.state.previewVideoTrack }),
            react_1.default.createElement("div", { "aria-live": 'polite' }, this._renderVideoSelector()),
            !hideAdditionalSettings && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: classes.checkboxContainer },
                    react_1.default.createElement(Checkbox_1.default, { checked: localFlipX, label: t('videothumbnail.mirrorVideo'), 
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange: () => super._onChange({ localFlipX: !localFlipX }) })),
                this._renderFramerateSelect()))));
    }
    /**
     * Creates the JitsiTrack for the video input preview.
     *
     * @param {string} deviceId - The id of video device to preview.
     * @private
     * @returns {void}
     */
    _createVideoInputTrack(deviceId) {
        const { hideVideoInputPreview } = this.props;
        if (hideVideoInputPreview) {
            return;
        }
        return this._disposeVideoInputPreview()
            .then(() => (0, functions_web_1.createLocalTrack)('video', deviceId, 5000))
            .then(jitsiLocalTrack => {
            if (!jitsiLocalTrack) {
                return Promise.reject();
            }
            if (this._unMounted) {
                jitsiLocalTrack.dispose();
                return;
            }
            this.setState({
                previewVideoTrack: jitsiLocalTrack,
                previewVideoTrackError: null
            });
        })
            .catch(() => {
            this.setState({
                previewVideoTrack: null,
                previewVideoTrackError: this.props.t('deviceSelection.previewUnavailable')
            });
        });
    }
    /**
     * Utility function for disposing the current video input preview.
     *
     * @private
     * @returns {Promise}
     */
    _disposeVideoInputPreview() {
        return this.state.previewVideoTrack
            ? this.state.previewVideoTrack.dispose() : Promise.resolve();
    }
    /**
     * Creates a DeviceSelector instance based on the passed in configuration.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderVideoSelector() {
        const { availableDevices, hasVideoPermission } = this.props;
        const videoConfig = {
            devices: availableDevices.videoInput,
            hasPermission: hasVideoPermission,
            icon: 'icon-camera',
            isDisabled: this.props.disableVideoInputSelect || this.props.disableDeviceChange,
            key: 'videoInput',
            id: 'videoInput',
            label: 'settings.selectCamera',
            onSelect: (selectedVideoInputId) => super._onChange({ selectedVideoInputId }),
            selectedDeviceId: this.state.previewVideoTrack
                ? this.state.previewVideoTrack.getDeviceId() : this.props.selectedVideoInputId
        };
        return (react_1.default.createElement(DeviceSelector_web_1.default, { ...videoConfig, key: videoConfig.id }));
    }
    /**
     * Callback invoked to select a frame rate from the select dropdown.
     *
     * @param {Object} e - The key event to handle.
     * @private
     * @returns {void}
     */
    _onFramerateItemSelect(e) {
        const frameRate = e.target.value;
        super._onChange({ currentFramerate: frameRate });
    }
    /**
     * Returns the React Element for the desktop share frame rate dropdown.
     *
     * @returns {JSX}
     */
    _renderFramerateSelect() {
        const { currentFramerate, desktopShareFramerates, t } = this.props;
        const frameRateItems = desktopShareFramerates.map((frameRate) => {
            return {
                value: frameRate,
                label: `${frameRate} ${t('settings.framesPerSecond')}`
            };
        });
        return (react_1.default.createElement(Select_1.default, { bottomLabel: parseInt(currentFramerate, 10) > constants_1.SS_DEFAULT_FRAME_RATE
                ? t('settings.desktopShareHighFpsWarning')
                : t('settings.desktopShareWarning'), id: 'more-framerate-select', label: t('settings.desktopShareFramerate'), onChange: this._onFramerateItemSelect, options: frameRateItems, value: currentFramerate }));
    }
}
const mapStateToProps = (state) => {
    return {
        availableDevices: state['features/base/devices'].availableDevices ?? {}
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)((0, mui_1.withStyles)((0, functions_1.translate)(VideoDeviceSelection), styles));
