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
            flexDirection: 'column',
            width: '100%',
            paddingBottom: theme.spacing(3)
        },
        checkbox: {
            marginBottom: theme.spacing(3)
        },
        listContainer: {
            listStyleType: 'none',
            padding: 0,
            margin: 0
        },
        listItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `${theme.spacing(1)} 0`,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            color: theme.palette.text01
        },
        listItemKey: {
            backgroundColor: theme.palette.ui04,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelBold),
            padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
            borderRadius: `${Number(theme.shape.borderRadius) / 2}px`
        }
    };
};
/**
 * React {@code Component} for modifying the local user's profile.
 *
 * @augments Component
 */
class ShortcutsTab extends AbstractDialogTab_1.default {
    /**
     * Initializes a new {@code MoreTab} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handler so it is only bound once for every instance.
        this._onKeyboardShortcutEnableChanged = this._onKeyboardShortcutEnableChanged.bind(this);
        this._renderShortcutsListItem = this._renderShortcutsListItem.bind(this);
    }
    /**
     * Callback invoked to select if global keyboard shortcuts
     * should be enabled.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyboardShortcutEnableChanged({ target: { checked } }) {
        super._onChange({ keyboardShortcutsEnabled: checked });
    }
    /**
     * Render a keyboard shortcut with key and description.
     *
     * @param {string} keyboardKey - The keyboard key for the shortcut.
     * @param {string} translationKey - The translation key for the shortcut description.
     * @returns {JSX}
     */
    _renderShortcutsListItem(keyboardKey, translationKey) {
        const { t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        let modifierKey = 'Alt';
        if (window.navigator?.platform) {
            if (window.navigator.platform.indexOf('Mac') !== -1) {
                modifierKey = '⌥';
            }
        }
        return (react_1.default.createElement("li", { className: classes.listItem, key: keyboardKey },
            react_1.default.createElement("span", { "aria-label": t(translationKey) }, t(translationKey)),
            react_1.default.createElement("span", { className: classes.listItemKey }, keyboardKey.startsWith(':')
                ? `${modifierKey} + ${keyboardKey.slice(1)}`
                : keyboardKey)));
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { displayShortcuts, keyboardShortcutsHelpDescriptions, keyboardShortcutsEnabled, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        const shortcutDescriptions = displayShortcuts
            ? keyboardShortcutsHelpDescriptions
            : new Map();
        return (react_1.default.createElement("div", { className: classes.container },
            react_1.default.createElement(Checkbox_1.default, { checked: keyboardShortcutsEnabled, className: classes.checkbox, label: t('prejoin.keyboardShortcuts'), name: 'enable-keyboard-shortcuts', onChange: this._onKeyboardShortcutEnableChanged }),
            displayShortcuts && (react_1.default.createElement("ul", { className: classes.listContainer }, Array.from(shortcutDescriptions)
                .map(description => this._renderShortcutsListItem(...description))))));
    }
}
exports.default = (0, mui_1.withStyles)((0, functions_1.translate)(ShortcutsTab), styles);
