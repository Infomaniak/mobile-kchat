"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clsx_1 = __importDefault(require("clsx"));
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const AbstractDialogTab_1 = __importDefault(require("../../../base/dialog/components/web/AbstractDialogTab"));
const functions_1 = require("../../../base/i18n/functions");
const Checkbox_1 = __importDefault(require("../../../base/ui/components/web/Checkbox"));
const Select_1 = __importDefault(require("../../../base/ui/components/web/Select"));
const constants_1 = require("../../../filmstrip/constants");
const styles = (theme) => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'column',
            padding: '0 2px'
        },
        divider: {
            margin: `${theme.spacing(4)} 0`,
            width: '100%',
            height: '1px',
            border: 0,
            backgroundColor: theme.palette.ui03
        },
        checkbox: {
            margin: `${theme.spacing(3)} 0`
        }
    };
};
/**
 * React {@code Component} for modifying language and moderator settings.
 *
 * @augments Component
 */
class MoreTab extends AbstractDialogTab_1.default {
    /**
     * Initializes a new {@code MoreTab} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handler so it is only bound once for every instance.
        this._onShowPrejoinPageChanged = this._onShowPrejoinPageChanged.bind(this);
        this._renderMaxStageParticipantsSelect = this._renderMaxStageParticipantsSelect.bind(this);
        this._onMaxStageParticipantsSelect = this._onMaxStageParticipantsSelect.bind(this);
        this._onHideSelfViewChanged = this._onHideSelfViewChanged.bind(this);
        this._onLanguageItemSelect = this._onLanguageItemSelect.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { showPrejoinSettings, disableHideSelfView, iAmVisitor, hideSelfView, showLanguageSettings, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement("div", { className: (0, clsx_1.default)('more-tab', classes.container), key: 'more' },
            showPrejoinSettings && react_1.default.createElement(react_1.default.Fragment, null,
                this._renderPrejoinScreenSettings(),
                react_1.default.createElement("hr", { className: classes.divider })),
            this._renderMaxStageParticipantsSelect(),
            !disableHideSelfView && !iAmVisitor && (react_1.default.createElement(Checkbox_1.default, { checked: hideSelfView, className: classes.checkbox, label: t('videothumbnail.hideSelfView'), name: 'hide-self-view', onChange: this._onHideSelfViewChanged })),
            showLanguageSettings && this._renderLanguageSelect()));
    }
    /**
     * Callback invoked to select if the lobby
     * should be shown.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onShowPrejoinPageChanged({ target: { checked } }) {
        super._onChange({ showPrejoinPage: checked });
    }
    /**
     * Callback invoked to select a max number of stage participants from the select dropdown.
     *
     * @param {Object} e - The key event to handle.
     * @private
     * @returns {void}
     */
    _onMaxStageParticipantsSelect(e) {
        const maxParticipants = Number(e.target.value);
        super._onChange({ maxStageParticipants: maxParticipants });
    }
    /**
     * Callback invoked to select if hide self view should be enabled.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onHideSelfViewChanged({ target: { checked } }) {
        super._onChange({ hideSelfView: checked });
    }
    /**
     * Callback invoked to select a language from select dropdown.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onLanguageItemSelect(e) {
        const language = e.target.value;
        super._onChange({ currentLanguage: language });
    }
    /**
     * Returns the React Element for modifying prejoin screen settings.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderPrejoinScreenSettings() {
        const { t, showPrejoinPage } = this.props;
        return (react_1.default.createElement(Checkbox_1.default, { checked: showPrejoinPage, label: t('prejoin.showScreen'), name: 'show-prejoin-page', onChange: this._onShowPrejoinPageChanged }));
    }
    /**
     * Returns the React Element for the max stage participants dropdown.
     *
     * @returns {ReactElement}
     */
    _renderMaxStageParticipantsSelect() {
        const { maxStageParticipants, t, stageFilmstripEnabled } = this.props;
        if (!stageFilmstripEnabled) {
            return null;
        }
        const maxParticipantsItems = Array(constants_1.MAX_ACTIVE_PARTICIPANTS).fill(0)
            .map((no, index) => {
            return {
                value: index + 1,
                label: `${index + 1}`
            };
        });
        return (react_1.default.createElement(Select_1.default, { id: 'more-maxStageParticipants-select', label: t('settings.maxStageParticipants'), onChange: this._onMaxStageParticipantsSelect, options: maxParticipantsItems, value: maxStageParticipants }));
    }
    /**
     * Returns the menu item for changing displayed language.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderLanguageSelect() {
        const { currentLanguage, languages, t } = this.props;
        const languageItems = languages.map((language) => {
            return {
                value: language,
                label: t(`languages:${language}`)
            };
        });
        return (react_1.default.createElement(Select_1.default, { id: 'more-language-select', label: t('settings.language'), onChange: this._onLanguageItemSelect, options: languageItems, value: currentLanguage }));
    }
}
exports.default = (0, mui_1.withStyles)((0, functions_1.translate)(MoreTab), styles);
