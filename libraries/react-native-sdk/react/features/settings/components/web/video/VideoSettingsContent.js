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
const svg_1 = require("../../../../base/icons/svg");
const index_1 = require("../../../../base/media/components/index");
const functions_1 = require("../../../../base/redux/functions");
const actions_1 = require("../../../../base/settings/actions");
const functions_web_1 = require("../../../../base/styles/functions.web");
const Checkbox_1 = __importDefault(require("../../../../base/ui/components/web/Checkbox"));
const ContextMenu_1 = __importDefault(require("../../../../base/ui/components/web/ContextMenu"));
const ContextMenuItem_1 = __importDefault(require("../../../../base/ui/components/web/ContextMenuItem"));
const ContextMenuItemGroup_1 = __importDefault(require("../../../../base/ui/components/web/ContextMenuItemGroup"));
const functions_2 = require("../../../../virtual-background/functions");
const actions_2 = require("../../../actions");
const constants_1 = require("../../../constants");
const functions_web_2 = require("../../../functions.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            maxHeight: 'calc(100dvh - 100px)',
            overflow: 'auto',
            margin: 0,
            marginBottom: theme.spacing(1),
            position: 'relative',
            right: 'auto'
        },
        previewEntry: {
            cursor: 'pointer',
            height: '138px',
            width: '244px',
            position: 'relative',
            margin: '0 7px',
            marginBottom: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
            boxSizing: 'border-box',
            overflow: 'hidden',
            '&:last-child': {
                marginBottom: 0
            }
        },
        selectedEntry: {
            border: `2px solid ${theme.palette.action01Hover}`
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
            height: '100%',
            width: '100%',
            position: 'absolute'
        },
        labelContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: '100%',
            zIndex: 2,
            padding: theme.spacing(2)
        },
        label: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '4px',
            padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
            color: theme.palette.text01,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelBold),
            width: 'fit-content',
            maxwidth: `calc(100% - ${theme.spacing(2)} - ${theme.spacing(2)})`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        checkboxContainer: {
            padding: '10px 14px'
        }
    };
});
const stopPropagation = (e) => {
    e.stopPropagation();
};
const VideoSettingsContent = ({ changeFlip, currentCameraDeviceId, localFlipX, selectBackground, setVideoInputDevice, toggleVideoSettings, videoDeviceIds, visibleVirtualBackground }) => {
    const _componentWasUnmounted = (0, react_1.useRef)(false);
    const [trackData, setTrackData] = (0, react_1.useState)(new Array(videoDeviceIds.length).fill({
        jitsiTrack: null
    }));
    const { t } = (0, react_i18next_1.useTranslation)();
    const videoDevicesRef = (0, react_1.useRef)(videoDeviceIds);
    const trackDataRef = (0, react_1.useRef)(trackData);
    const { classes, cx } = useStyles();
    /**
     * Toggles local video flip state.
     *
     * @returns {void}
     */
    const _onToggleFlip = (0, react_1.useCallback)(() => {
        changeFlip(!localFlipX);
    }, [localFlipX, changeFlip]);
    /**
     * Destroys all the tracks from trackData object.
     *
     * @param {Object[]} tracks - An array of tracks that are to be disposed.
     * @returns {Promise<void>}
     */
    const _disposeTracks = (tracks) => {
        tracks.forEach(({ jitsiTrack }) => {
            jitsiTrack?.dispose();
        });
    };
    /**
     * Creates and updates the track data.
     *
     * @returns {void}
     */
    const _setTracks = async () => {
        _disposeTracks(trackData);
        const newTrackData = await (0, functions_web_2.createLocalVideoTracks)(videoDeviceIds, 5000);
        // In case the component gets unmounted before the tracks are created
        // avoid a leak by not setting the state
        if (_componentWasUnmounted.current) {
            _disposeTracks(newTrackData);
        }
        else {
            setTrackData(newTrackData);
            trackDataRef.current = newTrackData;
        }
    };
    /**
     * Returns the click handler used when selecting the video preview.
     *
     * @param {string} deviceId - The id of the camera device.
     * @returns {Function}
     */
    const _onEntryClick = (deviceId) => () => {
        setVideoInputDevice(deviceId);
        toggleVideoSettings();
    };
    /**
     * Renders a preview entry.
     *
     * @param {Object} data - The track data.
     * @param {number} index - The index of the entry.
     * @returns {React$Node}
     */
    // eslint-disable-next-line react/no-multi-comp
    const _renderPreviewEntry = (data, index) => {
        const { error, jitsiTrack, deviceId } = data;
        const isSelected = deviceId === currentCameraDeviceId;
        const key = `vp-${index}`;
        const tabIndex = '0';
        if (error) {
            return (react_1.default.createElement("div", { className: classes.previewEntry, key: key, tabIndex: -1 },
                react_1.default.createElement("div", { className: classes.error }, t(error))));
        }
        const previewProps = {
            className: classes.previewEntry,
            key,
            tabIndex
        };
        const label = jitsiTrack?.getTrackLabel();
        if (isSelected) {
            previewProps['aria-checked'] = true;
            previewProps.className = cx(classes.previewEntry, classes.selectedEntry);
        }
        else {
            previewProps.onClick = _onEntryClick(deviceId);
            previewProps.onKeyPress = (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    previewProps.onClick();
                }
            };
        }
        return (react_1.default.createElement("div", { ...previewProps, role: 'radio' },
            react_1.default.createElement("div", { className: classes.labelContainer }, label && react_1.default.createElement("div", { className: classes.label },
                react_1.default.createElement("span", null, label))),
            react_1.default.createElement(index_1.Video, { className: cx(classes.previewVideo, 'flipVideoX'), playsinline: true, videoTrack: { jitsiTrack } })));
    };
    (0, react_1.useEffect)(() => {
        _setTracks();
        return () => {
            _componentWasUnmounted.current = true;
            _disposeTracks(trackDataRef.current);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!(0, functions_1.equals)(videoDeviceIds, videoDevicesRef.current)) {
            _setTracks();
            videoDevicesRef.current = videoDeviceIds;
        }
    }, [videoDeviceIds]);
    return (react_1.default.createElement(ContextMenu_1.default, { "aria-labelledby": 'video-settings-button', className: classes.container, hidden: false, id: 'video-settings-dialog', role: 'radiogroup', tabIndex: -1 },
        react_1.default.createElement(ContextMenuItemGroup_1.default, null, trackData.map((data, i) => _renderPreviewEntry(data, i))),
        react_1.default.createElement(ContextMenuItemGroup_1.default, null,
            visibleVirtualBackground && react_1.default.createElement(ContextMenuItem_1.default, { accessibilityLabel: t('virtualBackground.title'), icon: svg_1.IconImage, onClick: selectBackground, text: t('virtualBackground.title') }),
            react_1.default.createElement("div", { className: classes.checkboxContainer, onClick: stopPropagation },
                react_1.default.createElement(Checkbox_1.default, { checked: localFlipX, label: t('videothumbnail.mirrorVideo'), onChange: _onToggleFlip })))));
};
const mapStateToProps = (state) => {
    const { localFlipX } = state['features/base/settings'];
    return {
        localFlipX: Boolean(localFlipX),
        visibleVirtualBackground: (0, functions_2.checkBlurSupport)()
            && (0, functions_2.checkVirtualBackgroundEnabled)(state)
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        selectBackground: () => dispatch((0, actions_2.openSettingsDialog)(constants_1.SETTINGS_TABS.VIRTUAL_BACKGROUND)),
        changeFlip: (flip) => {
            dispatch((0, actions_1.updateSettings)({
                localFlipX: flip
            }));
        }
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(VideoSettingsContent);
