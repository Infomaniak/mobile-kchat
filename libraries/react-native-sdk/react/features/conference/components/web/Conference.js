"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
// @ts-expect-error
const VideoLayout_1 = __importDefault(require("../../../../../modules/UI/videolayout/VideoLayout"));
const functions_1 = require("../../../base/conference/functions");
const actions_web_1 = require("../../../base/connection/actions.web");
const utils_1 = require("../../../base/environment/utils");
const functions_2 = require("../../../base/i18n/functions");
const helpers_1 = require("../../../base/util/helpers");
const Chat_1 = __importDefault(require("../../../chat/components/web/Chat"));
const MainFilmstrip_1 = __importDefault(require("../../../filmstrip/components/web/MainFilmstrip"));
const ScreenshareFilmstrip_1 = __importDefault(require("../../../filmstrip/components/web/ScreenshareFilmstrip"));
const StageFilmstrip_1 = __importDefault(require("../../../filmstrip/components/web/StageFilmstrip"));
const CalleeInfoContainer_1 = __importDefault(require("../../../invite/components/callee-info/CalleeInfoContainer"));
const LargeVideo_web_1 = __importDefault(require("../../../large-video/components/LargeVideo.web"));
const LobbyScreen_1 = __importDefault(require("../../../lobby/components/web/LobbyScreen"));
const functions_3 = require("../../../lobby/functions");
const functions_web_1 = require("../../../overlay/functions.web");
const ParticipantsPane_1 = __importDefault(require("../../../participants-pane/components/web/ParticipantsPane"));
const Prejoin_1 = __importDefault(require("../../../prejoin/components/web/Prejoin"));
const functions_4 = require("../../../prejoin/functions");
const ReactionsAnimations_1 = __importDefault(require("../../../reactions/components/web/ReactionsAnimations"));
const actions_any_1 = require("../../../toolbox/actions.any");
const actions_web_2 = require("../../../toolbox/actions.web");
const JitsiPortal_1 = __importDefault(require("../../../toolbox/components/web/JitsiPortal"));
const Toolbox_1 = __importDefault(require("../../../toolbox/components/web/Toolbox"));
const constants_1 = require("../../../video-layout/constants");
const functions_any_1 = require("../../../video-layout/functions.any");
const actions_web_3 = require("../../actions.web");
const functions_web_2 = require("../../functions.web");
const AbstractConference_1 = require("../AbstractConference");
const ConferenceInfo_1 = __importDefault(require("./ConferenceInfo"));
const Notice_1 = __importDefault(require("./Notice"));
/**
 * DOM events for when full screen mode has changed. Different browsers need
 * different vendor prefixes.
 *
 * @private
 * @type {Array<string>}
 */
const FULL_SCREEN_EVENTS = [
    'webkitfullscreenchange',
    'mozfullscreenchange',
    'fullscreenchange'
];
/**
 * The conference page of the Web application.
 */
class Conference extends AbstractConference_1.AbstractConference {
    /**
     * Initializes a new Conference instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        const { _mouseMoveCallbackInterval } = props;
        // Throttle and bind this component's mousemove handler to prevent it
        // from firing too often.
        this._originalOnShowToolbar = this._onShowToolbar;
        this._originalOnMouseMove = this._onMouseMove;
        this._onShowToolbar = lodash_1.default.throttle(() => this._originalOnShowToolbar(), 100, {
            leading: true,
            trailing: false
        });
        this._onMouseMove = lodash_1.default.throttle(event => this._originalOnMouseMove(event), _mouseMoveCallbackInterval, {
            leading: true,
            trailing: false
        });
        // Bind event handler so it is only bound once for every instance.
        this._onFullScreenChange = this._onFullScreenChange.bind(this);
        this._onVidespaceTouchStart = this._onVidespaceTouchStart.bind(this);
        this._setBackground = this._setBackground.bind(this);
    }
    /**
     * Start the connection and get the UI ready for the conference.
     *
     * @inheritdoc
     */
    componentDidMount() {
        document.title = `${this.props._roomName} | ${interfaceConfig.APP_NAME}`;
        this._start();
    }
    /**
     * Calls into legacy UI to update the application layout, if necessary.
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidUpdate(prevProps) {
        if (this.props._shouldDisplayTileView
            === prevProps._shouldDisplayTileView) {
            return;
        }
        // TODO: For now VideoLayout is being called as LargeVideo and Filmstrip
        // sizing logic is still handled outside of React. Once all components
        // are in react they should calculate size on their own as much as
        // possible and pass down sizings.
        VideoLayout_1.default.refreshLayout();
    }
    /**
     * Disconnect from the conference when component will be
     * unmounted.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        APP.UI.unbindEvents();
        FULL_SCREEN_EVENTS.forEach(name => document.removeEventListener(name, this._onFullScreenChange));
        APP.conference.isJoined() && this.props.dispatch((0, actions_web_1.hangup)());
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _isAnyOverlayVisible, _layoutClassName, _notificationsVisible, _overflowDrawer, _showLobby, _showPrejoin, t } = this.props;
        return (react_1.default.createElement("div", { id: 'layout_wrapper', onMouseEnter: this._onMouseEnter, onMouseLeave: this._onMouseLeave, onMouseMove: this._onMouseMove, ref: this._setBackground },
            react_1.default.createElement(Chat_1.default, null),
            react_1.default.createElement("div", { className: _layoutClassName, id: 'videoconference_page', onMouseMove: (0, utils_1.isMobileBrowser)() ? undefined : this._onShowToolbar },
                react_1.default.createElement(ConferenceInfo_1.default, null),
                react_1.default.createElement(Notice_1.default, null),
                react_1.default.createElement("div", { id: 'videospace', onTouchStart: this._onVidespaceTouchStart },
                    react_1.default.createElement(LargeVideo_web_1.default, null),
                    _showPrejoin || _showLobby || (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(StageFilmstrip_1.default, null),
                        react_1.default.createElement(ScreenshareFilmstrip_1.default, null),
                        react_1.default.createElement(MainFilmstrip_1.default, null)))),
                _showPrejoin || _showLobby || (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("span", { "aria-level": 1, className: 'sr-only', role: 'heading' }, t('toolbar.accessibilityLabel.heading')),
                    react_1.default.createElement(Toolbox_1.default, null))),
                _notificationsVisible && !_isAnyOverlayVisible && (_overflowDrawer
                    ? react_1.default.createElement(JitsiPortal_1.default, { className: 'notification-portal' }, this.renderNotificationsContainer({ portal: true }))
                    : this.renderNotificationsContainer()),
                react_1.default.createElement(CalleeInfoContainer_1.default, null),
                _showPrejoin && react_1.default.createElement(Prejoin_1.default, null),
                _showLobby && react_1.default.createElement(LobbyScreen_1.default, null)),
            react_1.default.createElement(ParticipantsPane_1.default, null),
            react_1.default.createElement(ReactionsAnimations_1.default, null)));
    }
    /**
     * Sets custom background opacity based on config. It also applies the
     * opacity on parent element, as the parent element is not accessible directly,
     * only though it's child.
     *
     * @param {Object} element - The DOM element for which to apply opacity.
     *
     * @private
     * @returns {void}
     */
    _setBackground(element) {
        if (!element) {
            return;
        }
        if (this.props._backgroundAlpha !== undefined) {
            const elemColor = element.style.background;
            const alphaElemColor = (0, helpers_1.setColorAlpha)(elemColor, this.props._backgroundAlpha);
            element.style.background = alphaElemColor;
            if (element.parentElement) {
                const parentColor = element.parentElement.style.background;
                const alphaParentColor = (0, helpers_1.setColorAlpha)(parentColor, this.props._backgroundAlpha);
                element.parentElement.style.background = alphaParentColor;
            }
        }
    }
    /**
     * Handler used for touch start on Video container.
     *
     * @private
     * @returns {void}
     */
    _onVidespaceTouchStart() {
        this.props.dispatch((0, actions_any_1.toggleToolboxVisible)());
    }
    /**
     * Updates the Redux state when full screen mode has been enabled or
     * disabled.
     *
     * @private
     * @returns {void}
     */
    _onFullScreenChange() {
        this.props.dispatch((0, actions_web_2.fullScreenChanged)(APP.UI.isFullScreen()));
    }
    /**
     * Triggers iframe API mouseEnter event.
     *
     * @param {MouseEvent} event - The mouse event.
     * @private
     * @returns {void}
     */
    _onMouseEnter(event) {
        APP.API.notifyMouseEnter(event);
    }
    /**
     * Triggers iframe API mouseLeave event.
     *
     * @param {MouseEvent} event - The mouse event.
     * @private
     * @returns {void}
     */
    _onMouseLeave(event) {
        APP.API.notifyMouseLeave(event);
    }
    /**
     * Triggers iframe API mouseMove event.
     *
     * @param {MouseEvent} event - The mouse event.
     * @private
     * @returns {void}
     */
    _onMouseMove(event) {
        APP.API.notifyMouseMove(event);
    }
    /**
     * Displays the toolbar.
     *
     * @private
     * @returns {void}
     */
    _onShowToolbar() {
        this.props.dispatch((0, actions_web_2.showToolbox)());
    }
    /**
     * Until we don't rewrite UI using react components
     * we use UI.start from old app. Also method translates
     * component right after it has been mounted.
     *
     * @inheritdoc
     */
    _start() {
        APP.UI.start();
        APP.UI.bindEvents();
        FULL_SCREEN_EVENTS.forEach(name => document.addEventListener(name, this._onFullScreenChange));
        const { dispatch, t } = this.props;
        dispatch((0, actions_web_3.init)());
        (0, functions_web_2.maybeShowSuboptimalExperienceNotification)(dispatch, t);
    }
}
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code Conference} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { backgroundAlpha, mouseMoveCallbackInterval } = state['features/base/config'];
    const { overflowDrawer } = state['features/toolbox'];
    return {
        ...(0, AbstractConference_1.abstractMapStateToProps)(state),
        _backgroundAlpha: backgroundAlpha,
        _isAnyOverlayVisible: Boolean((0, functions_web_1.getOverlayToRender)(state)),
        _layoutClassName: constants_1.LAYOUT_CLASSNAMES[(0, functions_any_1.getCurrentLayout)(state) ?? ''],
        _mouseMoveCallbackInterval: mouseMoveCallbackInterval,
        _overflowDrawer: overflowDrawer,
        _roomName: (0, functions_1.getConferenceNameForTitle)(state),
        _showLobby: (0, functions_3.getIsLobbyVisible)(state),
        _showPrejoin: (0, functions_4.isPrejoinPageVisible)(state)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)((0, functions_2.translate)(Conference));
