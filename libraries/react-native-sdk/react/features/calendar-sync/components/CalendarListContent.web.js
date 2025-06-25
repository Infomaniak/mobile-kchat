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
const actions_web_1 = require("../../app/actions.web");
const MeetingsList_1 = __importDefault(require("../../base/react/components/web/MeetingsList"));
const AddMeetingUrlButton_web_1 = __importDefault(require("./AddMeetingUrlButton.web"));
const JoinButton_web_1 = __importDefault(require("./JoinButton.web"));
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
        this._onJoinPress = this._onJoinPress.bind(this);
        this._onPress = this._onPress.bind(this);
        this._toDisplayableItem = this._toDisplayableItem.bind(this);
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
        const { _eventList = [] } = this.props;
        const meetings = _eventList.map(this._toDisplayableItem);
        return (react_1.default.createElement(MeetingsList_1.default, { disabled: disabled, listEmptyComponent: listEmptyComponent, meetings: meetings, onPress: this._onPress }));
    }
    /**
     * Handles the list's navigate action.
     *
     * @private
     * @param {Object} event - The click event.
     * @param {string} url - The url string to navigate to.
     * @returns {void}
     */
    _onJoinPress(event, url) {
        event.stopPropagation();
        this._onPress(url, 'meeting.join');
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
        this.props.dispatch((0, actions_web_1.appNavigate)(url));
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
            elementAfter: event.url
                ? react_1.default.createElement(JoinButton_web_1.default, { onPress: this._onJoinPress, url: event.url })
                : (react_1.default.createElement(AddMeetingUrlButton_web_1.default, { calendarId: event.calendarId, eventId: event.id })),
            date: event.startDate,
            time: [event.startDate, event.endDate],
            description: event.url,
            title: event.title,
            url: event.url
        };
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
 * @returns {{
 *     _eventList: Array<Object>
 * }}
 */
function _mapStateToProps(state) {
    return {
        _eventList: state['features/calendar-sync'].events
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(CalendarListContent);
