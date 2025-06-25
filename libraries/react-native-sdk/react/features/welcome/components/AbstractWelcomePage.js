"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = exports.AbstractWelcomePage = void 0;
// @ts-expect-error
const random_1 = require("@jitsi/js-utils/random");
const react_1 = require("react");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_1 = require("../../app/actions");
const isInsecureRoomName_1 = __importDefault(require("../../base/util/isInsecureRoomName"));
const functions_2 = require("../../calendar-sync/functions");
const functions_3 = require("../../prejoin/functions");
const functions_4 = require("../../recent-list/functions");
/**
 * Base (abstract) class for container component rendering the welcome page.
 *
 * @abstract
 */
class AbstractWelcomePage extends react_1.Component {
    /**
     * Initializes a new {@code AbstractWelcomePage} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code AbstractWelcomePage} instance with.
     */
    constructor(props) {
        super(props);
        /**
         * Save room name into component's local state.
         *
         * @type {Object}
         * @property {number|null} animateTimeoutId - Identifier of the letter
         * animation timeout.
         * @property {string} generatedRoomName - Automatically generated room name.
         * @property {string} room - Room name.
         * @property {string} roomPlaceholder - Room placeholder that's used as a
         * placeholder for input.
         * @property {number|null} updateTimeoutId - Identifier of the timeout
         * updating the generated room name.
         */
        this.state = {
            animateTimeoutId: undefined,
            generatedRoomName: '',
            generateRoomNames: undefined,
            insecureRoomName: false,
            joining: false,
            room: '',
            roomPlaceholder: '',
            updateTimeoutId: undefined,
            _fieldFocused: false,
            isSettingsScreenFocused: false,
            roomNameInputAnimation: 0,
            hintBoxAnimation: 0
        };
        // Bind event handlers so they are only bound once per instance.
        this._animateRoomNameChanging
            = this._animateRoomNameChanging.bind(this);
        this._onJoin = this._onJoin.bind(this);
        this._onRoomChange = this._onRoomChange.bind(this);
        this._renderInsecureRoomNameWarning = this._renderInsecureRoomNameWarning.bind(this);
        this._updateRoomName = this._updateRoomName.bind(this);
    }
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._mounted = true;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createWelcomePageEvent)('viewed', undefined, { value: 1 }));
    }
    /**
     * Implements React's {@link Component#componentWillUnmount()}. Invoked
     * immediately before this component is unmounted and destroyed.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this._clearTimeouts();
        this._mounted = false;
    }
    /**
     * Animates the changing of the room name.
     *
     * @param {string} word - The part of room name that should be added to
     * placeholder.
     * @private
     * @returns {void}
     */
    _animateRoomNameChanging(word) {
        let animateTimeoutId;
        const roomPlaceholder = this.state.roomPlaceholder + word.substr(0, 1);
        if (word.length > 1) {
            animateTimeoutId
                = window.setTimeout(() => {
                    this._animateRoomNameChanging(word.substring(1, word.length));
                }, 70);
        }
        this.setState({
            animateTimeoutId,
            roomPlaceholder
        });
    }
    /**
     * Method that clears timeouts for animations and updates of room name.
     *
     * @private
     * @returns {void}
     */
    _clearTimeouts() {
        this.state.animateTimeoutId && clearTimeout(this.state.animateTimeoutId);
        this.state.updateTimeoutId && clearTimeout(this.state.updateTimeoutId);
    }
    /**
     * Renders the insecure room name warning.
     *
     * @returns {ReactElement}
     */
    _doRenderInsecureRoomNameWarning() {
        return null;
    }
    /**
     * Handles joining. Either by clicking on 'Join' button
     * or by pressing 'Enter' in room name input field.
     *
     * @protected
     * @returns {void}
     */
    _onJoin() {
        const room = this.state.room || this.state.generatedRoomName;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createWelcomePageEvent)('clicked', 'joinButton', {
            isGenerated: !this.state.room,
            room
        }));
        if (room) {
            this.setState({ joining: true });
            // By the time the Promise of appNavigate settles, this component
            // may have already been unmounted.
            const onAppNavigateSettled = () => this._mounted && this.setState({ joining: false });
            this.props.dispatch((0, actions_1.appNavigate)(room))
                .then(onAppNavigateSettled, onAppNavigateSettled);
        }
    }
    /**
     * Handles 'change' event for the room name text input field.
     *
     * @param {string} value - The text typed into the respective text input
     * field.
     * @protected
     * @returns {void}
     */
    _onRoomChange(value) {
        this.setState({
            room: value,
            insecureRoomName: Boolean(this.props._enableInsecureRoomNameWarning && value && (0, isInsecureRoomName_1.default)(value))
        });
    }
    /**
     * Renders the insecure room name warning if needed.
     *
     * @returns {ReactElement}
     */
    _renderInsecureRoomNameWarning() {
        if (this.props._enableInsecureRoomNameWarning && this.state.insecureRoomName) {
            return this._doRenderInsecureRoomNameWarning();
        }
        return null;
    }
    /**
     * Triggers the generation of a new room name and initiates an animation of
     * its changing.
     *
     * @protected
     * @returns {void}
     */
    _updateRoomName() {
        const generatedRoomName = (0, random_1.generateRoomWithoutSeparator)();
        const roomPlaceholder = '';
        const updateTimeoutId = window.setTimeout(this._updateRoomName, 10000);
        this._clearTimeouts();
        this.setState({
            generatedRoomName,
            roomPlaceholder,
            updateTimeoutId
        }, () => this._animateRoomNameChanging(generatedRoomName));
    }
}
exports.AbstractWelcomePage = AbstractWelcomePage;
/**
 * Maps (parts of) the redux state to the React {@code Component} props of
 * {@code AbstractWelcomePage}.
 *
 * @param {Object} state - The redux state.
 * @protected
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    return {
        _calendarEnabled: (0, functions_2.isCalendarEnabled)(state),
        _deeplinkingCfg: state['features/base/config'].deeplinking || {},
        _enableInsecureRoomNameWarning: (0, functions_3.isUnsafeRoomWarningEnabled)(state),
        _moderatedRoomServiceUrl: state['features/base/config'].moderatedRoomServiceUrl,
        _recentListEnabled: (0, functions_4.isRecentListEnabled)(),
        _room: state['features/base/conference'].room ?? '',
        _settings: state['features/base/settings']
    };
}
exports._mapStateToProps = _mapStateToProps;
