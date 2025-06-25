"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const actions_web_1 = require("../../../../base/devices/actions.web");
const functions_web_1 = require("../../../../base/devices/functions.web");
const Popover_web_1 = __importDefault(require("../../../../base/popover/components/Popover.web"));
const constants_1 = require("../../../../base/responsive-ui/constants");
const functions_web_2 = require("../../../../base/settings/functions.web");
const actions_1 = require("../../../actions");
const functions_web_3 = require("../../../functions.web");
const VideoSettingsContent_1 = __importDefault(require("./VideoSettingsContent"));
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        container: {
            background: 'none',
            display: 'inline-block'
        }
    };
});
/**
 * Popup with a preview of all the video devices.
 *
 * @returns {ReactElement}
 */
function VideoSettingsPopup({ currentCameraDeviceId, children, isOpen, onClose, popupPlacement, setVideoInputDevice, videoDeviceIds }) {
    const { classes, cx } = useStyles();
    return (react_1.default.createElement("div", { className: cx('video-preview', classes.container) },
        react_1.default.createElement(Popover_web_1.default, { allowClick: true, content: react_1.default.createElement(VideoSettingsContent_1.default, { currentCameraDeviceId: currentCameraDeviceId, setVideoInputDevice: setVideoInputDevice, toggleVideoSettings: onClose, videoDeviceIds: videoDeviceIds }), headingId: 'video-settings-button', onPopoverClose: onClose, position: popupPlacement, trigger: 'click', visible: isOpen }, children)));
}
/**
 * Maps (parts of) the redux state to the associated {@code VideoSettingsPopup}'s
 * props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
function mapStateToProps(state) {
    const { clientWidth } = state['features/base/responsive-ui'];
    return {
        currentCameraDeviceId: (0, functions_web_2.getCurrentCameraDeviceId)(state),
        isOpen: Boolean((0, functions_web_3.getVideoSettingsVisibility)(state)),
        popupPlacement: clientWidth <= Number(constants_1.SMALL_MOBILE_WIDTH) ? 'auto' : 'top-end',
        videoDeviceIds: (0, functions_web_1.getVideoDeviceIds)(state) ?? []
    };
}
const mapDispatchToProps = {
    onClose: actions_1.toggleVideoSettings,
    setVideoInputDevice: actions_web_1.setVideoInputDeviceAndUpdateSettings
};
exports.default = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(VideoSettingsPopup);
