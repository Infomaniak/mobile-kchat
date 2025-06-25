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
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_native_1 = require("../../app/actions.native");
const dateUtil_1 = require("../../base/i18n/dateUtil");
const functions_2 = require("../../base/i18n/functions");
const NavigateSectionList_1 = __importDefault(require("../../base/react/components/native/NavigateSectionList"));
const actions_native_2 = require("../actions.native");
/**
 * Component to display a list of events from a connected calendar.
 */
class CalendarListContent extends react_1.Component {
    /**
     * Initializes a new {@code CalendarListContent} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onPress = this._onPress.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._onSecondaryAction = this._onSecondaryAction.bind(this);
        this._toDateString = this._toDateString.bind(this);
        this._toDisplayableItem = this._toDisplayableItem.bind(this);
        this._toDisplayableList = this._toDisplayableList.bind(this);
        this._toTimeString = this._toTimeString.bind(this);
    }
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createCalendarSelectedEvent)());
    }
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { disabled, listEmptyComponent } = this.props;
        return (<NavigateSectionList_1.default disabled={disabled} onPress={this._onPress} onRefresh={this._onRefresh} onSecondaryAction={this._onSecondaryAction} renderListEmptyComponent={listEmptyComponent} sections={this._toDisplayableList()}/>);
    }
    /**
     * Handles the list's navigate action.
     *
     * @private
     * @param {string} url - The url string to navigate to.
     * @param {string} analyticsEventName - Тhe name of the analytics event
     * associated with this action.
     * @returns {void}
     */
    _onPress(url, analyticsEventName = 'meeting.tile') {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createCalendarClickedEvent)(analyticsEventName));
        this.props.dispatch((0, actions_native_1.appNavigate)(url));
    }
    /**
     * Callback to execute when the list is doing a pull-to-refresh.
     *
     * @private
     * @returns {void}
     */
    _onRefresh() {
        this.props.dispatch((0, actions_native_2.refreshCalendar)(true));
    }
    /**
     * Handles the list's secondary action.
     *
     * @private
     * @param {string} id - The ID of the item on which the secondary action was
     * performed.
     * @returns {void}
     */
    _onSecondaryAction(id) {
        this.props.dispatch((0, actions_native_2.openUpdateCalendarEventDialog)(id));
    }
    /**
     * Generates a date string for a given event.
     *
     * @param {Object} event - The event.
     * @private
     * @returns {string}
     */
    _toDateString(event) {
        const startDateTime = (0, dateUtil_1.getLocalizedDateFormatter)(event.startDate).format('MMM Do, YYYY');
        return `${startDateTime}`;
    }
    /**
     * Creates a displayable object from an event.
     *
     * @param {Object} event - The calendar event.
     * @private
     * @returns {Object}
     */
    _toDisplayableItem(event) {
        return {
            id: event.id,
            key: `${event.id}-${event.startDate}`,
            lines: [
                event.url,
                this._toTimeString(event)
            ],
            title: event.title,
            url: event.url
        };
    }
    /**
     * Transforms the event list to a displayable list with sections.
     *
     * @private
     * @returns {Array<Object>}
     */
    _toDisplayableList() {
        const { _eventList, t } = this.props;
        const now = new Date();
        const { createSection } = NavigateSectionList_1.default;
        const TODAY_SECTION = 'today';
        const sectionMap = new Map();
        for (const event of _eventList) {
            const displayableEvent = this._toDisplayableItem(event);
            const startDate = new Date(event.startDate).getDate();
            if (startDate === now.getDate()) {
                let todaySection = sectionMap.get(TODAY_SECTION);
                if (!todaySection) {
                    todaySection
                        = createSection(t('calendarSync.today'), TODAY_SECTION);
                    sectionMap.set(TODAY_SECTION, todaySection);
                }
                todaySection.data.push(displayableEvent);
            }
            else if (sectionMap.has(startDate)) {
                const section = sectionMap.get(startDate);
                if (section) {
                    section.data.push(displayableEvent);
                }
            }
            else {
                const newSection = createSection(this._toDateString(event), startDate);
                sectionMap.set(startDate, newSection);
                newSection.data.push(displayableEvent);
            }
        }
        return Array.from(sectionMap.values());
    }
    /**
     * Generates a time (interval) string for a given event.
     *
     * @param {Object} event - The event.
     * @private
     * @returns {string}
     */
    _toTimeString(event) {
        const startDateTime = (0, dateUtil_1.getLocalizedDateFormatter)(event.startDate).format('lll');
        const endTime = (0, dateUtil_1.getLocalizedDateFormatter)(event.endDate).format('LT');
        return `${startDateTime} - ${endTime}`;
    }
}
/**
 * Default values for the component's props.
 */
CalendarListContent.defaultProps = {
    _eventList: []
};
/**
 * Maps redux state to component props.
 *
 * @param {Object} state - The redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    return {
        _eventList: state['features/calendar-sync'].events
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(CalendarListContent));
