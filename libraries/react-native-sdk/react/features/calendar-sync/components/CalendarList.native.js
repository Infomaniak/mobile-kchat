"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../base/i18n/functions");
const AbstractPage_1 = __importDefault(require("../../base/react/components/AbstractPage"));
const functions_2 = require("../../mobile/permissions/functions");
const actions_native_1 = require("../actions.native");
const CalendarListContent_native_1 = __importDefault(require("./CalendarListContent.native"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Component to display a list of events from the (mobile) user's calendar.
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
    }
    /**
     * Public API method for {@code Component}s rendered in
     * {@link AbstractPagedList}. When invoked, refreshes the calendar entries
     * in the app.
     *
     * @param {Function} dispatch - The Redux dispatch function.
     * @param {boolean} isInteractive - If true this refresh was caused by
     * direct user interaction, false otherwise.
     * @public
     * @returns {void}
     */
    static refresh(dispatch, isInteractive) {
        dispatch((0, actions_native_1.refreshCalendar)(false, isInteractive));
    }
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { disabled } = this.props;
        return (CalendarListContent_native_1.default
            ? <react_native_1.View style={(disabled
                    ? styles_1.default.calendarSyncDisabled
                    : styles_1.default.calendarSync)}>
                    <CalendarListContent_native_1.default disabled={disabled} listEmptyComponent={this._getRenderListEmptyComponent()}/>
                </react_native_1.View>
            : null);
    }
    /**
     * Returns a list empty component if a custom one has to be rendered instead
     * of the default one in the {@link NavigateSectionList}.
     *
     * @private
     * @returns {?React$Component}
     */
    _getRenderListEmptyComponent() {
        const { _authorization, t } = this.props;
        // If we don't provide a list specific renderListEmptyComponent, then
        // the default empty component of the NavigateSectionList will be
        // rendered, which (atm) is a simple "Pull to refresh" message.
        if (_authorization !== 'denied') {
            return <></>;
        }
        return (<react_native_1.View style={styles_1.default.noPermissionMessageView}>
                <react_native_1.Text style={styles_1.default.noPermissionMessageText}>
                    {t('calendarSync.permissionMessage')}
                </react_native_1.Text>
                <react_native_1.TouchableOpacity onPress={functions_2.openSettings} style={styles_1.default.noPermissionMessageButton}>
                    <react_native_1.Text style={styles_1.default.noPermissionMessageButtonText}>
                        {t('calendarSync.permissionButton')}
                    </react_native_1.Text>
                </react_native_1.TouchableOpacity>
            </react_native_1.View>);
    }
}
/**
 * Maps redux state to component props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _authorization: ?string,
 *     _eventList: Array<Object>
 * }}
 */
function _mapStateToProps(state) {
    const { authorization } = state['features/calendar-sync'];
    return {
        _authorization: authorization
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(CalendarList));
