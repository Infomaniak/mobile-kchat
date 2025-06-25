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
exports.mapStateToProps = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../actions");
const functions_1 = require("../../functions");
const NotificationsTransition_1 = __importDefault(require("../NotificationsTransition"));
const Notification_1 = __importDefault(require("./Notification"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements a React {@link Component} which displays notifications and handles
 * automatic dismissal after a notification is shown for a defined timeout
 * period.
 *
 * @augments {Component}
 */
class NotificationsContainer extends react_1.Component {
    /**
     * Initializes a new {@code NotificationsContainer} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        /**
         * The timeout set for automatically dismissing a displayed
         * notification. This value is set on the instance and not state to
         * avoid additional re-renders.
         *
         * @type {number|null}
         */
        this._notificationDismissTimeout = null;
        // Bind event handlers so they are only bound once for every instance.
        this._onDismissed = this._onDismissed.bind(this);
    }
    /**
     * Sets a timeout (if applicable).
     *
     * @inheritdoc
     */
    componentDidMount() {
        // Set the initial dismiss timeout (if any)
        // @ts-ignore
        this._manageDismissTimeout();
    }
    /**
     * Sets a timeout if the currently displayed notification has changed.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        this._manageDismissTimeout(prevProps);
    }
    /**
     * Sets/clears the dismiss timeout for the top notification.
     *
     * @param {IProps} [prevProps] - The previous properties (if called from
     * {@code componentDidUpdate}).
     * @returns {void}
     * @private
     */
    _manageDismissTimeout(prevProps) {
        const { _notifications } = this.props;
        if (_notifications.length) {
            const notification = _notifications[0];
            const previousNotification = prevProps?._notifications.length
                ? prevProps._notifications[0] : undefined;
            if (notification !== previousNotification) {
                this._clearNotificationDismissTimeout();
                // @ts-ignore
                if (notification?.timeout) {
                    // @ts-ignore
                    const { timeout, uid } = notification;
                    // @ts-ignore
                    this._notificationDismissTimeout = setTimeout(() => {
                        // Perform a no-op if a timeout is not specified.
                        this._onDismissed(uid);
                    }, timeout);
                }
            }
        }
        else if (this._notificationDismissTimeout) {
            // Clear timeout when all notifications are cleared (e.g external
            // call to clear them)
            this._clearNotificationDismissTimeout();
        }
    }
    /**
     * Clear any dismissal timeout that is still active.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this._clearNotificationDismissTimeout();
    }
    /**
     * Clears the running notification dismiss timeout, if any.
     *
     * @returns {void}
     */
    _clearNotificationDismissTimeout() {
        this._notificationDismissTimeout && clearTimeout(this._notificationDismissTimeout);
        this._notificationDismissTimeout = null;
    }
    /**
     * Emits an action to remove the notification from the redux store so it
     * stops displaying.
     *
     * @param {Object} uid - The id of the notification to be removed.
     * @private
     * @returns {void}
     */
    _onDismissed(uid) {
        const { _notifications } = this.props;
        // Clear the timeout only if it's the top notification that's being
        // dismissed (the timeout is set only for the top one).
        // @ts-ignore
        if (!_notifications.length || _notifications[0].uid === uid) {
            this._clearNotificationDismissTimeout();
        }
        this.props.dispatch((0, actions_1.hideNotification)(uid));
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { _notifications, shouldDisplayTileView, toolboxVisible } = this.props;
        let notificationsContainerStyle;
        if (shouldDisplayTileView) {
            if (toolboxVisible) {
                notificationsContainerStyle = styles_1.default.withToolboxTileView;
            }
            else {
                notificationsContainerStyle = styles_1.default.withoutToolboxTileView;
            }
        }
        else {
            notificationsContainerStyle
                = toolboxVisible ? styles_1.default.withToolbox : styles_1.default.withoutToolbox;
        }
        return (<react_native_safe_area_context_1.SafeAreaView edges={[react_native_1.Platform.OS === 'ios' && 'bottom', 'left', 'right'].filter(Boolean)} style={notificationsContainerStyle}>
                <NotificationsTransition_1.default>
                    {_notifications.map(notification => {
                // @ts-ignore
                const { props, uid } = notification;
                return (<Notification_1.default {...props} key={uid} onDismissed={this._onDismissed} uid={uid}/>);
            })}
                </NotificationsTransition_1.default>
            </react_native_safe_area_context_1.SafeAreaView>);
    }
}
/**
 * Maps (parts of) the Redux state to the associated NotificationsContainer's
 * props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function mapStateToProps(state) {
    const { notifications } = state['features/notifications'];
    const _visible = (0, functions_1.areThereNotifications)(state);
    return {
        _notifications: _visible ? notifications : []
    };
}
exports.mapStateToProps = mapStateToProps;
exports.default = (0, react_redux_1.connect)(mapStateToProps)(NotificationsContainer);
