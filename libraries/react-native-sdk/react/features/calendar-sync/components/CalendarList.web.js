"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const functions_2 = require("../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../base/icons/components/Icon"));
const svg_1 = require("../../base/icons/svg");
const AbstractPage_1 = __importDefault(require("../../base/react/components/AbstractPage"));
const Spinner_1 = __importDefault(require("../../base/ui/components/web/Spinner"));
const actions_web_1 = require("../../settings/actions.web");
const constants_1 = require("../../settings/constants");
const actions_web_2 = require("../actions.web");
const constants_2 = require("../constants");
const CalendarListContent_web_1 = __importDefault(require("./CalendarListContent.web"));
/**
 * Component to display a list of events from the user's calendar.
 */
class CalendarList extends AbstractPage_1.default {
    /**
     * Initializes a new {@code CalendarList} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._getRenderListEmptyComponent
            = this._getRenderListEmptyComponent.bind(this);
        this._onOpenSettings = this._onOpenSettings.bind(this);
        this._onKeyPressOpenSettings = this._onKeyPressOpenSettings.bind(this);
        this._onRefreshEvents = this._onRefreshEvents.bind(this);
    }
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { disabled } = this.props;
        return (CalendarListContent_web_1.default
            ? react_1.default.createElement(CalendarListContent_web_1.default, { disabled: Boolean(disabled), listEmptyComponent: this._getRenderListEmptyComponent() })
            : null);
    }
    /**
     * Returns a component for showing the error message related to calendar
     * sync.
     *
     * @private
     * @returns {React$Component}
     */
    _getErrorMessage() {
        const { _calendarError = { error: undefined }, t } = this.props;
        let errorMessageKey = 'calendarSync.error.generic';
        let showRefreshButton = true;
        let showSettingsButton = true;
        if (_calendarError.error === constants_2.ERRORS.GOOGLE_APP_MISCONFIGURED) {
            errorMessageKey = 'calendarSync.error.appConfiguration';
            showRefreshButton = false;
            showSettingsButton = false;
        }
        else if (_calendarError.error === constants_2.ERRORS.AUTH_FAILED) {
            errorMessageKey = 'calendarSync.error.notSignedIn';
            showRefreshButton = false;
        }
        return (react_1.default.createElement("div", { className: 'meetings-list-empty' },
            react_1.default.createElement("p", { className: 'description' }, t(errorMessageKey)),
            react_1.default.createElement("div", { className: 'calendar-action-buttons' },
                showSettingsButton
                    && react_1.default.createElement("div", { className: 'button', onClick: this._onOpenSettings }, t('calendarSync.permissionButton')),
                showRefreshButton
                    && react_1.default.createElement("div", { className: 'button', onClick: this._onRefreshEvents }, t('calendarSync.refresh')))));
    }
    /**
     * Returns a list empty component if a custom one has to be rendered instead
     * of the default one in the {@link NavigateSectionList}.
     *
     * @private
     * @returns {React$Component}
     */
    _getRenderListEmptyComponent() {
        const { _calendarError, _hasIntegrationSelected, _hasLoadedEvents, t } = this.props;
        if (_calendarError) {
            return this._getErrorMessage();
        }
        else if (_hasIntegrationSelected && _hasLoadedEvents) {
            return (react_1.default.createElement("div", { className: 'meetings-list-empty' },
                react_1.default.createElement("p", { className: 'description' }, t('calendarSync.noEvents')),
                react_1.default.createElement("div", { className: 'button', onClick: this._onRefreshEvents }, t('calendarSync.refresh'))));
        }
        else if (_hasIntegrationSelected && !_hasLoadedEvents) {
            return (react_1.default.createElement("div", { className: 'meetings-list-empty' },
                react_1.default.createElement(Spinner_1.default, null)));
        }
        return (react_1.default.createElement("div", { className: 'meetings-list-empty' },
            react_1.default.createElement("div", { className: 'meetings-list-empty-image' },
                react_1.default.createElement("img", { alt: t('welcomepage.logo.calendar'), src: './images/calendar.svg' })),
            react_1.default.createElement("div", { className: 'description' }, t('welcomepage.connectCalendarText', {
                app: interfaceConfig.APP_NAME,
                provider: interfaceConfig.PROVIDER_NAME
            })),
            react_1.default.createElement("div", { className: 'meetings-list-empty-button', onClick: this._onOpenSettings, onKeyPress: this._onKeyPressOpenSettings, role: 'button', tabIndex: 0 },
                react_1.default.createElement(Icon_1.default, { className: 'meetings-list-empty-icon', src: svg_1.IconCalendar }),
                react_1.default.createElement("span", null, t('welcomepage.connectCalendarButton')))));
    }
    /**
     * Opens {@code SettingsDialog}.
     *
     * @private
     * @returns {void}
     */
    _onOpenSettings() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createCalendarClickedEvent)('connect'));
        this.props.dispatch((0, actions_web_1.openSettingsDialog)(constants_1.SETTINGS_TABS.CALENDAR));
    }
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyPressOpenSettings(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this._onOpenSettings();
        }
    }
    /**
     * Gets an updated list of calendar events.
     *
     * @private
     * @returns {void}
     */
    _onRefreshEvents() {
        this.props.dispatch((0, actions_web_2.refreshCalendar)(true));
    }
}
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code CalendarList} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _calendarError: Object,
 *     _hasIntegrationSelected: boolean,
 *     _hasLoadedEvents: boolean
 * }}
 */
function _mapStateToProps(state) {
    const { error, events, integrationType, isLoadingEvents } = state['features/calendar-sync'];
    return {
        _calendarError: error,
        _hasIntegrationSelected: Boolean(integrationType),
        _hasLoadedEvents: Boolean(events) || !isLoadingEvents
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(CalendarList));
