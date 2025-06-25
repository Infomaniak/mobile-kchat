"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clsx_1 = __importDefault(require("clsx"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const DeviceStatus_1 = __importDefault(require("../../../../prejoin/components/web/preview/DeviceStatus"));
const functions_1 = require("../../../../prejoin/functions");
const Toolbox_1 = __importDefault(require("../../../../toolbox/components/web/Toolbox"));
const functions_web_1 = require("../../../../toolbox/functions.web");
const functions_2 = require("../../../conference/functions");
const constants_1 = require("../../../config/constants");
const functions_web_2 = require("../../../styles/functions.web");
const ConnectionStatus_1 = __importDefault(require("./ConnectionStatus"));
const Preview_1 = __importDefault(require("./Preview"));
const RecordingWarning_1 = __importDefault(require("./RecordingWarning"));
const UnsafeRoomWarning_1 = __importDefault(require("./UnsafeRoomWarning"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            height: '100%',
            position: 'absolute',
            inset: '0 0 0 0',
            display: 'flex',
            backgroundColor: theme.palette.ui01,
            zIndex: 252,
            '@media (max-width: 720px)': {
                flexDirection: 'column-reverse'
            }
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexShrink: 0,
            boxSizing: 'border-box',
            margin: '0 48px',
            padding: '24px 0 16px',
            position: 'relative',
            width: '300px',
            height: '100%',
            zIndex: 252,
            '@media (max-width: 720px)': {
                height: 'auto',
                margin: '0 auto'
            },
            // mobile phone landscape
            '@media (max-width: 420px)': {
                padding: '16px 16px 0 16px',
                width: '100%'
            },
            '@media (max-width: 400px)': {
                padding: '16px'
            }
        },
        contentControls: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: 'auto',
            width: '100%'
        },
        title: {
            ...(0, functions_web_2.withPixelLineHeight)(theme.typography.heading4),
            color: `${theme.palette.text01}!important`,
            marginBottom: theme.spacing(3),
            textAlign: 'center',
            '@media (max-width: 400px)': {
                display: 'none'
            }
        },
        roomName: {
            ...(0, functions_web_2.withPixelLineHeight)(theme.typography.heading5),
            color: theme.palette.text01,
            marginBottom: theme.spacing(4),
            overflow: 'hidden',
            textAlign: 'center',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%'
        }
    };
});
const PreMeetingScreen = ({ _buttons, _premeetingBackground, _roomName, children, className, showDeviceStatus, showRecordingWarning, showUnsafeRoomWarning, skipPrejoinButton, title, videoMuted, videoTrack }) => {
    const { classes } = useStyles();
    const style = _premeetingBackground ? {
        background: _premeetingBackground,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
    } : {};
    return (react_1.default.createElement("div", { className: (0, clsx_1.default)('premeeting-screen', classes.container, className) },
        react_1.default.createElement("div", { style: style },
            react_1.default.createElement("div", { className: classes.content },
                react_1.default.createElement(ConnectionStatus_1.default, null),
                react_1.default.createElement("div", { className: classes.contentControls },
                    react_1.default.createElement("h1", { className: classes.title }, title),
                    _roomName && (react_1.default.createElement("span", { className: classes.roomName }, _roomName)),
                    children,
                    _buttons.length && react_1.default.createElement(Toolbox_1.default, { toolbarButtons: _buttons }),
                    skipPrejoinButton,
                    showUnsafeRoomWarning && react_1.default.createElement(UnsafeRoomWarning_1.default, null),
                    showDeviceStatus && react_1.default.createElement(DeviceStatus_1.default, null),
                    showRecordingWarning && react_1.default.createElement(RecordingWarning_1.default, null)))),
        react_1.default.createElement(Preview_1.default, { videoMuted: videoMuted, videoTrack: videoTrack })));
};
/**
 * Maps (parts of) the redux state to the React {@code Component} props.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The props passed to the component.
 * @returns {Object}
 */
function mapStateToProps(state, ownProps) {
    const { hiddenPremeetingButtons } = state['features/base/config'];
    const { toolbarButtons } = state['features/toolbox'];
    const premeetingButtons = (ownProps.thirdParty
        ? constants_1.THIRD_PARTY_PREJOIN_BUTTONS
        : constants_1.PREMEETING_BUTTONS).filter((b) => !(hiddenPremeetingButtons || []).includes(b));
    const { premeetingBackground } = state['features/dynamic-branding'];
    return {
        // For keeping backwards compat.: if we pass an empty hiddenPremeetingButtons
        // array through external api, we have all prejoin buttons present on premeeting
        // screen regardless of passed values into toolbarButtons config overwrite.
        // If hiddenPremeetingButtons is missing, we hide the buttons according to
        // toolbarButtons config overwrite.
        _buttons: hiddenPremeetingButtons
            ? premeetingButtons
            : premeetingButtons.filter(b => (0, functions_web_1.isButtonEnabled)(b, toolbarButtons)),
        _premeetingBackground: premeetingBackground,
        _roomName: (0, functions_1.isRoomNameEnabled)(state) ? (0, functions_2.getConferenceName)(state) : ''
    };
}
exports.default = (0, react_redux_1.connect)(mapStateToProps)(PreMeetingScreen);
