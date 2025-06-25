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
            flexDirection: 'column'
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
 * React {@code Component} for modifying language and moderator settings.
 *
 * @augments Component
 */
class ModeratorTab extends AbstractDialogTab_1.default {
    /**
     * Initializes a new {@code ModeratorTab} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handler so it is only bound once for every instance.
        this._onStartAudioMutedChanged = this._onStartAudioMutedChanged.bind(this);
        this._onStartVideoMutedChanged = this._onStartVideoMutedChanged.bind(this);
        this._onStartReactionsMutedChanged = this._onStartReactionsMutedChanged.bind(this);
        this._onFollowMeEnabledChanged = this._onFollowMeEnabledChanged.bind(this);
    }
    /**
     * Callback invoked to select if conferences should start
     * with audio muted.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onStartAudioMutedChanged({ target: { checked } }) {
        super._onChange({ startAudioMuted: checked });
    }
    /**
     * Callback invoked to select if conferences should start
     * with video disabled.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onStartVideoMutedChanged({ target: { checked } }) {
        super._onChange({ startVideoMuted: checked });
    }
    /**
     * Callback invoked to select if conferences should start
     * with reactions muted.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onStartReactionsMutedChanged({ target: { checked } }) {
        super._onChange({ startReactionsMuted: checked });
    }
    /**
     * Callback invoked to select if follow-me mode
     * should be activated.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onFollowMeEnabledChanged({ target: { checked } }) {
        super._onChange({ followMeEnabled: checked });
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { disableReactionsModeration, followMeActive, followMeEnabled, startAudioMuted, startVideoMuted, startReactionsMuted, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement("div", { className: `moderator-tab ${classes.container}`, key: 'moderator' },
            react_1.default.createElement("h2", { className: classes.title }, t('settings.moderatorOptions')),
            react_1.default.createElement(Checkbox_1.default, { checked: startAudioMuted, className: classes.checkbox, label: t('settings.startAudioMuted'), name: 'start-audio-muted', onChange: this._onStartAudioMutedChanged }),
            react_1.default.createElement(Checkbox_1.default, { checked: startVideoMuted, className: classes.checkbox, label: t('settings.startVideoMuted'), name: 'start-video-muted', onChange: this._onStartVideoMutedChanged }),
            react_1.default.createElement(Checkbox_1.default, { checked: followMeEnabled && !followMeActive, className: classes.checkbox, disabled: followMeActive, label: t('settings.followMe'), name: 'follow-me', onChange: this._onFollowMeEnabledChanged }),
            !disableReactionsModeration
                && react_1.default.createElement(Checkbox_1.default, { checked: startReactionsMuted, className: classes.checkbox, label: t('settings.startReactionsMuted'), name: 'start-reactions-muted', onChange: this._onStartReactionsMutedChanged })));
    }
}
exports.default = (0, mui_1.withStyles)((0, functions_1.translate)(ModeratorTab), styles);
