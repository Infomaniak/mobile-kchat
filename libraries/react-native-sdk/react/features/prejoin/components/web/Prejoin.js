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
/* eslint-disable react/jsx-no-bind */
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const functions_web_1 = require("../../../base/config/functions.web");
const svg_1 = require("../../../base/icons/svg");
const functions_1 = require("../../../base/media/functions");
const functions_2 = require("../../../base/participants/functions");
const Popover_web_1 = __importDefault(require("../../../base/popover/components/Popover.web"));
const ActionButton_1 = __importDefault(require("../../../base/premeeting/components/web/ActionButton"));
const PreMeetingScreen_1 = __importDefault(require("../../../base/premeeting/components/web/PreMeetingScreen"));
const actions_1 = require("../../../base/settings/actions");
const functions_web_2 = require("../../../base/settings/functions.web");
const functions_web_3 = require("../../../base/styles/functions.web");
const functions_web_4 = require("../../../base/tracks/functions.web");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const Input_1 = __importDefault(require("../../../base/ui/components/web/Input"));
const constants_any_1 = require("../../../base/ui/constants.any");
const isInsecureRoomName_1 = __importDefault(require("../../../base/util/isInsecureRoomName"));
const actions_2 = require("../../../display-name/actions");
const functions_3 = require("../../../prejoin/functions");
const actions_web_1 = require("../../actions.web");
const functions_4 = require("../../functions");
const utils_1 = require("../../utils");
const JoinByPhoneDialog_1 = __importDefault(require("./dialogs/JoinByPhoneDialog"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        inputContainer: {
            width: '100%'
        },
        input: {
            width: '100%',
            marginBottom: theme.spacing(3),
            '& input': {
                textAlign: 'center'
            }
        },
        avatarContainer: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
        },
        avatar: {
            margin: `${theme.spacing(2)} auto ${theme.spacing(3)}`
        },
        avatarName: {
            ...(0, functions_web_3.withPixelLineHeight)(theme.typography.bodyShortBoldLarge),
            color: theme.palette.text01,
            marginBottom: theme.spacing(5),
            textAlign: 'center'
        },
        error: {
            backgroundColor: theme.palette.actionDanger,
            color: theme.palette.text01,
            borderRadius: theme.shape.borderRadius,
            width: '100%',
            ...(0, functions_web_3.withPixelLineHeight)(theme.typography.labelRegular),
            boxSizing: 'border-box',
            padding: theme.spacing(1),
            textAlign: 'center',
            marginTop: `-${theme.spacing(2)}`,
            marginBottom: theme.spacing(3)
        },
        dropdownContainer: {
            position: 'relative',
            width: '100%'
        },
        dropdownButtons: {
            width: '300px',
            padding: '8px 0',
            backgroundColor: theme.palette.action02,
            color: theme.palette.text04,
            borderRadius: theme.shape.borderRadius,
            position: 'relative',
            top: `-${theme.spacing(3)}`,
            '@media (max-width: 511px)': {
                margin: '0 auto',
                top: 0
            },
            '@media (max-width: 420px)': {
                top: 0,
                width: 'calc(100% - 32px)'
            }
        }
    };
});
const Prejoin = ({ deviceStatusVisible, hasJoinByPhoneButton, isDisplayNameVisible, joinConference, joinConferenceWithoutAudio, joiningInProgress, name, participantId, prejoinConfig, readOnlyName, setJoinByPhoneDialogVisiblity, showCameraPreview, showDialog, showErrorOnJoin, showRecordingWarning, showUnsafeRoomWarning, unsafeRoomConsent, updateSettings: dispatchUpdateSettings, videoTrack }) => {
    const showDisplayNameField = (0, react_1.useMemo)(() => isDisplayNameVisible && !readOnlyName, [isDisplayNameVisible, readOnlyName]);
    const showErrorOnField = (0, react_1.useMemo)(() => showDisplayNameField && showErrorOnJoin, [showDisplayNameField, showErrorOnJoin]);
    const [showJoinByPhoneButtons, setShowJoinByPhoneButtons] = (0, react_1.useState)(false);
    const { classes } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    /**
     * Handler for the join button.
     *
     * @param {Object} e - The synthetic event.
     * @returns {void}
     */
    const onJoinButtonClick = () => {
        if (showErrorOnJoin) {
            dispatch((0, actions_2.openDisplayNamePrompt)({
                onPostSubmit: joinConference,
                validateInput: utils_1.hasDisplayName
            }));
            return;
        }
        joinConference();
    };
    /**
     * Closes the dropdown.
     *
     * @returns {void}
     */
    const onDropdownClose = () => {
        setShowJoinByPhoneButtons(false);
    };
    /**
     * Displays the join by phone buttons dropdown.
     *
     * @param {Object} e - The synthetic event.
     * @returns {void}
     */
    const onOptionsClick = (e) => {
        e?.stopPropagation();
        setShowJoinByPhoneButtons(show => !show);
    };
    /**
     * Sets the guest participant name.
     *
     * @param {string} displayName - Participant name.
     * @returns {void}
     */
    const setName = (displayName) => {
        dispatchUpdateSettings({
            displayName
        });
    };
    /**
     * Closes the join by phone dialog.
     *
     * @returns {undefined}
     */
    const closeDialog = () => {
        setJoinByPhoneDialogVisiblity(false);
    };
    /**
     * Displays the dialog for joining a meeting by phone.
     *
     * @returns {undefined}
     */
    const doShowDialog = () => {
        setJoinByPhoneDialogVisiblity(true);
        onDropdownClose();
    };
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    const showDialogKeyPress = (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            doShowDialog();
        }
    };
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    const onJoinConferenceWithoutAudioKeyPress = (e) => {
        if (joinConferenceWithoutAudio
            && (e.key === ' '
                || e.key === 'Enter')) {
            e.preventDefault();
            joinConferenceWithoutAudio();
        }
    };
    /**
     * Gets the list of extra join buttons.
     *
     * @returns {Object} - The list of extra buttons.
     */
    const getExtraJoinButtons = () => {
        const noAudio = {
            key: 'no-audio',
            testId: 'prejoin.joinWithoutAudio',
            icon: svg_1.IconVolumeOff,
            label: t('prejoin.joinWithoutAudio'),
            onClick: joinConferenceWithoutAudio,
            onKeyPress: onJoinConferenceWithoutAudioKeyPress
        };
        const byPhone = {
            key: 'by-phone',
            testId: 'prejoin.joinByPhone',
            icon: svg_1.IconPhoneRinging,
            label: t('prejoin.joinAudioByPhone'),
            onClick: doShowDialog,
            onKeyPress: showDialogKeyPress
        };
        return {
            noAudio,
            byPhone
        };
    };
    /**
     * Handle keypress on input.
     *
     * @param {KeyboardEvent} e - Keyboard event.
     * @returns {void}
     */
    const onInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            joinConference();
        }
    };
    const extraJoinButtons = getExtraJoinButtons();
    let extraButtonsToRender = Object.values(extraJoinButtons).filter((val) => !(prejoinConfig?.hideExtraJoinButtons || []).includes(val.key));
    if (!hasJoinByPhoneButton) {
        extraButtonsToRender = extraButtonsToRender.filter((btn) => btn.key !== 'by-phone');
    }
    const hasExtraJoinButtons = Boolean(extraButtonsToRender.length);
    return (react_1.default.createElement(PreMeetingScreen_1.default, { showDeviceStatus: deviceStatusVisible, showRecordingWarning: showRecordingWarning, showUnsafeRoomWarning: showUnsafeRoomWarning, title: t('prejoin.joinMeeting'), videoMuted: !showCameraPreview, videoTrack: videoTrack },
        react_1.default.createElement("div", { className: classes.inputContainer, "data-testid": 'prejoin.screen' },
            showDisplayNameField ? (react_1.default.createElement(Input_1.default, { accessibilityLabel: t('dialog.enterDisplayName'), autoComplete: 'name', autoFocus: true, className: classes.input, error: showErrorOnField, id: 'premeeting-name-input', onChange: setName, onKeyPress: showUnsafeRoomWarning && !unsafeRoomConsent ? undefined : onInputKeyPress, placeholder: t('dialog.enterDisplayName'), readOnly: readOnlyName, value: name })) : (react_1.default.createElement("div", { className: classes.avatarContainer },
                react_1.default.createElement(Avatar_1.default, { className: classes.avatar, displayName: name, participantId: participantId, size: 72 }),
                isDisplayNameVisible && react_1.default.createElement("div", { className: classes.avatarName }, name))),
            showErrorOnField && react_1.default.createElement("div", { className: classes.error, "data-testid": 'prejoin.errorMessage' }, t('prejoin.errorMissingName')),
            react_1.default.createElement("div", { className: classes.dropdownContainer },
                react_1.default.createElement(Popover_web_1.default, { content: hasExtraJoinButtons && react_1.default.createElement("div", { className: classes.dropdownButtons }, extraButtonsToRender.map(({ key, ...rest }) => (react_1.default.createElement(Button_1.default, { disabled: joiningInProgress || showErrorOnField, fullWidth: true, key: key, type: constants_any_1.BUTTON_TYPES.SECONDARY, ...rest })))), onPopoverClose: onDropdownClose, position: 'bottom', trigger: 'click', visible: showJoinByPhoneButtons },
                    react_1.default.createElement(ActionButton_1.default, { OptionsIcon: showJoinByPhoneButtons ? svg_1.IconArrowUp : svg_1.IconArrowDown, ariaDropDownLabel: t('prejoin.joinWithoutAudio'), ariaLabel: t('prejoin.joinMeeting'), ariaPressed: showJoinByPhoneButtons, disabled: joiningInProgress
                            || (showUnsafeRoomWarning && !unsafeRoomConsent)
                            || showErrorOnField, hasOptions: hasExtraJoinButtons, onClick: onJoinButtonClick, onOptionsClick: onOptionsClick, role: 'button', tabIndex: 0, testId: 'prejoin.joinMeeting', type: 'primary' }, t('prejoin.joinMeeting'))))),
        showDialog && (react_1.default.createElement(JoinByPhoneDialog_1.default, { joinConferenceWithoutAudio: joinConferenceWithoutAudio, onClose: closeDialog }))));
};
/**
 * Maps (parts of) the redux state to the React {@code Component} props.
 *
 * @param {Object} state - The redux state.
 * @returns {Object}
 */
function mapStateToProps(state) {
    const name = (0, functions_web_2.getDisplayName)(state);
    const showErrorOnJoin = (0, functions_4.isDisplayNameRequired)(state) && !name;
    const { id: participantId } = (0, functions_2.getLocalParticipant)(state) ?? {};
    const { joiningInProgress } = state['features/prejoin'];
    const { room } = state['features/base/conference'];
    const { unsafeRoomConsent } = state['features/base/premeeting'];
    const { showPrejoinWarning: showRecordingWarning } = state['features/base/config'].recordings ?? {};
    return {
        deviceStatusVisible: (0, functions_4.isDeviceStatusVisible)(state),
        hasJoinByPhoneButton: (0, functions_4.isJoinByPhoneButtonVisible)(state),
        isDisplayNameVisible: (0, functions_4.isPrejoinDisplayNameVisible)(state),
        joiningInProgress,
        name,
        participantId,
        prejoinConfig: state['features/base/config'].prejoinConfig,
        readOnlyName: (0, functions_web_1.isNameReadOnly)(state),
        showCameraPreview: !(0, functions_1.isVideoMutedByUser)(state),
        showDialog: (0, functions_4.isJoinByPhoneDialogVisible)(state),
        showErrorOnJoin,
        showRecordingWarning: Boolean(showRecordingWarning),
        showUnsafeRoomWarning: (0, isInsecureRoomName_1.default)(room) && (0, functions_3.isUnsafeRoomWarningEnabled)(state),
        unsafeRoomConsent,
        videoTrack: (0, functions_web_4.getLocalJitsiVideoTrack)(state)
    };
}
const mapDispatchToProps = {
    joinConferenceWithoutAudio: actions_web_1.joinConferenceWithoutAudio,
    joinConference: actions_web_1.joinConference,
    setJoinByPhoneDialogVisiblity: actions_web_1.setJoinByPhoneDialogVisiblity,
    updateSettings: actions_1.updateSettings
};
exports.default = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(Prejoin);
