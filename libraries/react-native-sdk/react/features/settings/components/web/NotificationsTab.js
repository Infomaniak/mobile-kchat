"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const AbstractDialogTab_1 = __importDefault(require("../../../base/dialog/components/web/AbstractDialogTab"));
const functions_1 = require("../../../base/i18n/functions");
const functions_web_1 = require("../../../base/styles/functions.web");
const Checkbox_1 = __importDefault(require("../../../base/ui/components/web/Checkbox"));
const styles = (theme) => {
    return {
        container: {
            display: 'flex',
            width: '100%',
            '@media (max-width: 607px)': {
                flexDirection: 'column'
            }
        },
        column: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            '&:first-child:not(:last-child)': {
                marginRight: theme.spacing(3),
                '@media (max-width: 607px)': {
                    marginRight: 0,
                    marginBottom: theme.spacing(3)
                }
            }
        },
        title: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.heading6),
            color: `${theme.palette.text01} !important`,
            marginBottom: theme.spacing(3)
        },
        checkbox: {
            marginBottom: theme.spacing(3)
        }
    };
};
/**
 * React {@code Component} for modifying the local user's sound settings.
 *
 * @augments Component
 */
class NotificationsTab extends AbstractDialogTab_1.default {
    /**
     * Initializes a new {@code SoundsTab} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code SoundsTab} instance with.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once for every instance.
        this._onChange = this._onChange.bind(this);
        this._onEnabledNotificationsChanged = this._onEnabledNotificationsChanged.bind(this);
    }
    /**
     * Changes a sound setting state.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onChange({ target }) {
        super._onChange({ [target.name]: target.checked });
    }
    /**
     * Callback invoked to select if the given type of
     * notifications should be shown.
     *
     * @param {Object} e - The key event to handle.
     * @param {string} type - The type of the notification.
     *
     * @returns {void}
     */
    _onEnabledNotificationsChanged({ target: { checked } }, type) {
        super._onChange({
            enabledNotifications: {
                ...this.props.enabledNotifications,
                [type]: checked
            }
        });
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { disabledSounds, enabledNotifications, showNotificationsSettings, showSoundsSettings, soundsIncomingMessage, soundsParticipantJoined, soundsParticipantKnocking, soundsParticipantLeft, soundsTalkWhileMuted, soundsReactions, enableReactions, moderatorMutedSoundsReactions, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement("div", { className: classes.container, key: 'sounds' },
            showSoundsSettings && (react_1.default.createElement("div", { className: classes.column },
                react_1.default.createElement("h2", { className: classes.title }, t('settings.playSounds')),
                enableReactions && react_1.default.createElement(Checkbox_1.default, { checked: soundsReactions && !disabledSounds.includes('REACTION_SOUND'), className: classes.checkbox, disabled: Boolean(moderatorMutedSoundsReactions
                        || disabledSounds.includes('REACTION_SOUND')), label: t('settings.reactions'), name: 'soundsReactions', onChange: this._onChange }),
                react_1.default.createElement(Checkbox_1.default, { checked: soundsIncomingMessage && !disabledSounds.includes('INCOMING_MSG_SOUND'), className: classes.checkbox, disabled: disabledSounds.includes('INCOMING_MSG_SOUND'), label: t('settings.incomingMessage'), name: 'soundsIncomingMessage', onChange: this._onChange }),
                react_1.default.createElement(Checkbox_1.default, { checked: soundsParticipantJoined
                        && !disabledSounds.includes('PARTICIPANT_JOINED_SOUND'), className: classes.checkbox, disabled: disabledSounds.includes('PARTICIPANT_JOINED_SOUND'), label: t('settings.participantJoined'), name: 'soundsParticipantJoined', onChange: this._onChange }),
                react_1.default.createElement(Checkbox_1.default, { checked: soundsParticipantLeft && !disabledSounds.includes('PARTICIPANT_LEFT_SOUND'), className: classes.checkbox, disabled: disabledSounds.includes('PARTICIPANT_LEFT_SOUND'), label: t('settings.participantLeft'), name: 'soundsParticipantLeft', onChange: this._onChange }),
                react_1.default.createElement(Checkbox_1.default, { checked: soundsTalkWhileMuted && !disabledSounds.includes('TALK_WHILE_MUTED_SOUND'), className: classes.checkbox, disabled: disabledSounds.includes('TALK_WHILE_MUTED_SOUND'), label: t('settings.talkWhileMuted'), name: 'soundsTalkWhileMuted', onChange: this._onChange }),
                react_1.default.createElement(Checkbox_1.default, { checked: soundsParticipantKnocking
                        && !disabledSounds.includes('KNOCKING_PARTICIPANT_SOUND'), className: classes.checkbox, disabled: disabledSounds.includes('KNOCKING_PARTICIPANT_SOUND'), label: t('settings.participantKnocking'), name: 'soundsParticipantKnocking', onChange: this._onChange }))),
            showNotificationsSettings && (react_1.default.createElement("div", { className: classes.column },
                react_1.default.createElement("h2", { className: classes.title }, t('notify.displayNotifications')),
                Object.keys(enabledNotifications).map(key => (react_1.default.createElement(Checkbox_1.default, { checked: Boolean(enabledNotifications[key]), className: classes.checkbox, key: key, label: t(key), name: `show-${key}`, 
                    /* eslint-disable-next-line react/jsx-no-bind */
                    onChange: e => this._onEnabledNotificationsChanged(e, key) })))))));
    }
}
exports.default = (0, mui_1.withStyles)((0, functions_1.translate)(NotificationsTab), styles);
