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
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const actions_1 = require("../../base/dialog/actions");
const functions_1 = require("../../base/i18n/functions");
const index_1 = require("../../base/media/components/index");
const functions_2 = require("../../base/redux/functions");
const functions_3 = require("../../base/tracks/functions");
const Spinner_1 = __importDefault(require("../../base/ui/components/web/Spinner"));
const actions_2 = require("../../notifications/actions");
const constants_1 = require("../../notifications/constants");
const actions_3 = require("../actions");
const logger_1 = __importDefault(require("../logger"));
/**
 * Creates the styles for the component.
 *
 * @param {Object} theme - The current UI theme.
 *
 * @returns {Object}
 */
const styles = (theme) => {
    return {
        virtualBackgroundPreview: {
            height: 'auto',
            width: '100%',
            overflow: 'hidden',
            marginBottom: theme.spacing(3),
            zIndex: 2,
            borderRadius: '3px',
            backgroundColor: theme.palette.uiBackground,
            position: 'relative'
        },
        previewLoader: {
            height: '220px',
            '& svg': {
                position: 'absolute',
                top: '40%',
                left: '45%'
            }
        },
        previewVideo: {
            height: '100%',
            width: '100%',
            objectFit: 'cover'
        },
        error: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '220px',
            position: 'relative'
        }
    };
};
/**
 * Implements a React {@link PureComponent} which displays the virtual
 * background preview.
 *
 * @augments PureComponent
 */
class VirtualBackgroundPreview extends react_1.PureComponent {
    /**
     * Initializes a new {@code VirtualBackgroundPreview} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            localTrackLoaded: false,
            jitsiTrack: null
        };
    }
    /**
     * Destroys the jitsiTrack object.
     *
     * @param {Object} jitsiTrack - The track that needs to be disposed.
     * @returns {Promise<void>}
     */
    _stopStream(jitsiTrack) {
        if (jitsiTrack) {
            jitsiTrack.dispose();
        }
    }
    /**
     * Creates and updates the track data.
     *
     * @returns {void}
     */
    async _setTracks() {
        try {
            this.setState({ loading: true });
            const [jitsiTrack] = await (0, functions_3.createLocalTracksF)({
                cameraDeviceId: this.props.selectedVideoInputId,
                devices: ['video']
            });
            this.setState({ localTrackLoaded: true });
            // In case the component gets unmounted before the tracks are created
            // avoid a leak by not setting the state
            if (this._componentWasUnmounted) {
                this._stopStream(jitsiTrack);
                return;
            }
            this.setState({
                jitsiTrack,
                loading: false
            });
            this.props.loadedPreview(true);
        }
        catch (error) {
            this.props.dispatch((0, actions_1.hideDialog)());
            this.props.dispatch((0, actions_2.showWarningNotification)({
                titleKey: 'virtualBackground.backgroundEffectError',
                description: 'Failed to access camera device.'
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
            logger_1.default.error('Failed to access camera device. Error on apply background effect.');
            return;
        }
    }
    /**
     * Apply background effect on video preview.
     *
     * @returns {Promise}
     */
    async _applyBackgroundEffect() {
        this.setState({ loading: true });
        this.props.loadedPreview(false);
        await this.props.dispatch((0, actions_3.toggleBackgroundEffect)(this.props.options, this.state.jitsiTrack));
        this.props.loadedPreview(true);
        this.setState({ loading: false });
    }
    /**
     * Apply video preview loader.
     *
     * @returns {Promise}
     */
    _loadVideoPreview() {
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement("div", { className: classes.previewLoader },
            react_1.default.createElement(Spinner_1.default, { size: 'large' })));
    }
    /**
     * Renders a preview entry.
     *
     * @param {Object} data - The track data.
     * @returns {React$Node}
     */
    _renderPreviewEntry(data) {
        const { t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        if (this.state.loading) {
            return this._loadVideoPreview();
        }
        if (!data) {
            return (react_1.default.createElement("div", { className: classes.error }, t('deviceSelection.previewUnavailable')));
        }
        return (react_1.default.createElement(index_1.Video, { className: classes.previewVideo, playsinline: true, videoTrack: { jitsiTrack: data } }));
    }
    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._setTracks();
    }
    /**
     * Implements React's {@link Component#componentWillUnmount}.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this._componentWasUnmounted = true;
        this._stopStream(this.state.jitsiTrack);
    }
    /**
     * Implements React's {@link Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    async componentDidUpdate(prevProps) {
        if (!(0, functions_2.equals)(this.props.selectedVideoInputId, prevProps.selectedVideoInputId)) {
            this._setTracks();
        }
        if (!(0, functions_2.equals)(this.props.options, prevProps.options) && this.state.localTrackLoaded) {
            this._applyBackgroundEffect();
        }
    }
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { jitsiTrack } = this.state;
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement("div", { className: classes.virtualBackgroundPreview }, jitsiTrack
            ? this._renderPreviewEntry(jitsiTrack)
            : this._loadVideoPreview()));
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()((0, mui_1.withStyles)(VirtualBackgroundPreview, styles)));
