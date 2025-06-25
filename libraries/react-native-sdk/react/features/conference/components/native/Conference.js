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
const native_1 = require("@react-navigation/native");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const react_redux_1 = require("react-redux");
const actions_native_1 = require("../../../app/actions.native");
const actionTypes_1 = require("../../../base/conference/actionTypes");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const Container_1 = __importDefault(require("../../../base/react/components/native/Container"));
const LoadingIndicator_1 = __importDefault(require("../../../base/react/components/native/LoadingIndicator"));
const TintedView_1 = __importDefault(require("../../../base/react/components/native/TintedView"));
const constants_2 = require("../../../base/responsive-ui/constants");
const TestConnectionInfo_1 = __importDefault(require("../../../base/testing/components/TestConnectionInfo"));
const functions_native_1 = require("../../../calendar-sync/functions.native");
const DisplayNameLabel_1 = __importDefault(require("../../../display-name/components/native/DisplayNameLabel"));
const BrandingImageBackground_1 = __importDefault(require("../../../dynamic-branding/components/native/BrandingImageBackground"));
const Filmstrip_1 = __importDefault(require("../../../filmstrip/components/native/Filmstrip"));
const TileView_1 = __importDefault(require("../../../filmstrip/components/native/TileView"));
const constants_3 = require("../../../filmstrip/constants");
const functions_native_2 = require("../../../filmstrip/functions.native");
const CalleeInfoContainer_1 = __importDefault(require("../../../invite/components/callee-info/CalleeInfoContainer"));
const LargeVideo_native_1 = __importDefault(require("../../../large-video/components/LargeVideo.native"));
const functions_2 = require("../../../lobby/functions");
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const functions_3 = require("../../../mobile/picture-in-picture/functions");
const Captions_1 = __importDefault(require("../../../subtitles/components/native/Captions"));
const actions_native_2 = require("../../../toolbox/actions.native");
const Toolbox_1 = __importDefault(require("../../../toolbox/components/native/Toolbox"));
const functions_native_3 = require("../../../toolbox/functions.native");
const AbstractConference_1 = require("../AbstractConference");
const functions_native_4 = require("../functions.native");
const AlwaysOnLabels_1 = __importDefault(require("./AlwaysOnLabels"));
const ExpandedLabelPopup_1 = __importDefault(require("./ExpandedLabelPopup"));
const LonelyMeetingExperience_1 = __importDefault(require("./LonelyMeetingExperience"));
const TitleBar_1 = __importDefault(require("./TitleBar"));
const constants_4 = require("./constants");
const styles_1 = __importDefault(require("./styles"));
/**
 * The conference page of the mobile (i.e. React Native) application.
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
        this.state = {
            visibleExpandedLabel: undefined
        };
        this._expandedLabelTimeout = react_1.default.createRef();
        // Bind event handlers so they are only bound once per instance.
        this._onClick = this._onClick.bind(this);
        this._onHardwareBackPress = this._onHardwareBackPress.bind(this);
        this._setToolboxVisible = this._setToolboxVisible.bind(this);
        this._createOnPress = this._createOnPress.bind(this);
    }
    /**
     * Implements {@link Component#componentDidMount()}. Invoked immediately
     * after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        const { _audioOnlyEnabled, _startCarMode, navigation } = this.props;
        react_native_1.BackHandler.addEventListener('hardwareBackPress', this._onHardwareBackPress);
        if (_audioOnlyEnabled && _startCarMode) {
            navigation.navigate(routes_1.screen.conference.carmode);
        }
    }
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        const { _audioOnlyEnabled, _showLobby, _startCarMode } = this.props;
        if (!prevProps._showLobby && _showLobby) {
            (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.lobby.root);
        }
        if (prevProps._showLobby && !_showLobby) {
            if (_audioOnlyEnabled && _startCarMode) {
                return;
            }
            (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.main);
        }
    }
    /**
     * Implements {@link Component#componentWillUnmount()}. Invoked immediately
     * before this component is unmounted and destroyed. Disconnects the
     * conference described by the redux store/state.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        // Tear handling any hardware button presses for back navigation down.
        react_native_1.BackHandler.removeEventListener('hardwareBackPress', this._onHardwareBackPress);
        clearTimeout(this._expandedLabelTimeout.current ?? 0);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _brandingStyles, _fullscreenEnabled } = this.props;
        return (<Container_1.default style={[
                styles_1.default.conference,
                _brandingStyles
            ]}>
                <BrandingImageBackground_1.default />
                {react_native_1.Platform.OS === 'android'
                && <react_native_1.StatusBar barStyle='light-content' hidden={_fullscreenEnabled} translucent={_fullscreenEnabled}/>}
                {this._renderContent()}
            </Container_1.default>);
    }
    /**
     * Changes the value of the toolboxVisible state, thus allowing us to switch
     * between Toolbox and Filmstrip and change their visibility.
     *
     * @private
     * @returns {void}
     */
    _onClick() {
        this._setToolboxVisible(!this.props._toolboxVisible);
    }
    /**
     * Handles a hardware button press for back navigation. Enters Picture-in-Picture mode
     * (if supported) or leaves the associated {@code Conference} otherwise.
     *
     * @returns {boolean} Exiting the app is undesired, so {@code true} is always returned.
     */
    _onHardwareBackPress() {
        let p;
        if (this.props._pictureInPictureEnabled) {
            const { PictureInPicture } = react_native_1.NativeModules;
            p = PictureInPicture.enterPictureInPicture();
        }
        else {
            p = Promise.reject(new Error('PiP not enabled'));
        }
        p.catch(() => {
            this.props.dispatch((0, actions_native_1.appNavigate)(undefined));
        });
        return true;
    }
    /**
     * Creates a function to be invoked when the onPress of the touchables are
     * triggered.
     *
     * @param {string} label - The identifier of the label that's onLayout is
     * triggered.
     * @returns {Function}
     */
    _createOnPress(label) {
        return () => {
            const { visibleExpandedLabel } = this.state;
            const newVisibleExpandedLabel = visibleExpandedLabel === label ? undefined : label;
            clearTimeout(this._expandedLabelTimeout.current);
            this.setState({
                visibleExpandedLabel: newVisibleExpandedLabel
            });
            if (newVisibleExpandedLabel) {
                this._expandedLabelTimeout.current = setTimeout(() => {
                    this.setState({
                        visibleExpandedLabel: undefined
                    });
                }, constants_4.EXPANDED_LABEL_TIMEOUT);
            }
        };
    }
    /**
     * Renders the content for the Conference container.
     *
     * @private
     * @returns {React$Element}
     */
    _renderContent() {
        const { _aspectRatio, _connecting, _filmstripVisible, _largeVideoParticipantId, _reducedUI, _shouldDisplayTileView, _toolboxVisible } = this.props;
        let alwaysOnTitleBarStyles;
        if (_reducedUI) {
            return this._renderContentForReducedUi();
        }
        if (_aspectRatio === constants_2.ASPECT_RATIO_WIDE) {
            alwaysOnTitleBarStyles
                = !_shouldDisplayTileView && _filmstripVisible
                    ? styles_1.default.alwaysOnTitleBarWide
                    : styles_1.default.alwaysOnTitleBar;
        }
        else {
            alwaysOnTitleBarStyles = styles_1.default.alwaysOnTitleBar;
        }
        return (<>
                {/*
              * The LargeVideo is the lowermost stacking layer.
              */_shouldDisplayTileView
                ? <TileView_1.default onClick={this._onClick}/>
                : <LargeVideo_native_1.default onClick={this._onClick}/>}

                {/*
              * If there is a ringing call, show the callee's info.
              */<CalleeInfoContainer_1.default />}

                {/*
              * The activity/loading indicator goes above everything, except
              * the toolbox/toolbars and the dialogs.
              */_connecting
                && <TintedView_1.default>
                            <LoadingIndicator_1.default />
                        </TintedView_1.default>}

                <react_native_1.View pointerEvents='box-none' style={styles_1.default.toolboxAndFilmstripContainer}>

                    <Captions_1.default onPress={this._onClick}/>

                    {_shouldDisplayTileView
                || <Container_1.default style={styles_1.default.displayNameContainer}>
                            <DisplayNameLabel_1.default participantId={_largeVideoParticipantId}/>
                        </Container_1.default>}

                    {!_shouldDisplayTileView && <LonelyMeetingExperience_1.default />}

                    {_shouldDisplayTileView
                || <>
                            <Filmstrip_1.default />
                            {this._renderNotificationsContainer()}
                            <Toolbox_1.default />
                        </>}
                </react_native_1.View>

                <react_native_1.SafeAreaView pointerEvents='box-none' style={(_toolboxVisible
                ? styles_1.default.titleBarSafeViewColor
                : styles_1.default.titleBarSafeViewTransparent)}>
                    <TitleBar_1.default _createOnPress={this._createOnPress}/>
                </react_native_1.SafeAreaView>
                <react_native_1.SafeAreaView pointerEvents='box-none' style={(_toolboxVisible
                ? [styles_1.default.titleBarSafeViewTransparent, { top: this.props.insets.top + 50 }]
                : styles_1.default.titleBarSafeViewTransparent)}>
                    <react_native_1.View pointerEvents='box-none' style={styles_1.default.expandedLabelWrapper}>
                        <ExpandedLabelPopup_1.default visibleExpandedLabel={this.state.visibleExpandedLabel}/>
                    </react_native_1.View>
                    <react_native_1.View pointerEvents='box-none' style={alwaysOnTitleBarStyles}>
                        {/* eslint-disable-next-line react/jsx-no-bind */}
                        <AlwaysOnLabels_1.default createOnPress={this._createOnPress}/>
                    </react_native_1.View>
                </react_native_1.SafeAreaView>

                <TestConnectionInfo_1.default />

                {_shouldDisplayTileView
                && <>
                        {this._renderNotificationsContainer()}
                        <Toolbox_1.default />
                    </>}
            </>);
    }
    /**
     * Renders the content for the Conference container when in "reduced UI" mode.
     *
     * @private
     * @returns {React$Element}
     */
    _renderContentForReducedUi() {
        const { _connecting } = this.props;
        return (<>
                <LargeVideo_native_1.default onClick={this._onClick}/>

                {_connecting
                && <TintedView_1.default>
                            <LoadingIndicator_1.default />
                        </TintedView_1.default>}
            </>);
    }
    /**
     * Renders a container for notifications to be displayed by the
     * base/notifications feature.
     *
     * @private
     * @returns {React$Element}
     */
    _renderNotificationsContainer() {
        const notificationsStyle = {};
        // In the landscape mode (wide) there's problem with notifications being
        // shadowed by the filmstrip rendered on the right. This makes the "x"
        // button not clickable. In order to avoid that a margin of the
        // filmstrip's size is added to the right.
        //
        // Pawel: after many attempts I failed to make notifications adjust to
        // their contents width because of column and rows being used in the
        // flex layout. The only option that seemed to limit the notification's
        // size was explicit 'width' value which is not better than the margin
        // added here.
        const { _aspectRatio, _filmstripVisible } = this.props;
        if (_filmstripVisible && _aspectRatio !== constants_2.ASPECT_RATIO_NARROW) {
            notificationsStyle.marginRight = constants_3.FILMSTRIP_SIZE;
        }
        return super.renderNotificationsContainer({
            shouldDisplayTileView: this.props._shouldDisplayTileView,
            style: notificationsStyle,
            toolboxVisible: this.props._toolboxVisible
        });
    }
    /**
     * Dispatches an action changing the visibility of the {@link Toolbox}.
     *
     * @private
     * @param {boolean} visible - Pass {@code true} to show the
     * {@code Toolbox} or {@code false} to hide it.
     * @returns {void}
     */
    _setToolboxVisible(visible) {
        this.props.dispatch((0, actions_native_2.setToolboxVisible)(visible));
    }
}
/**
 * Maps (parts of) the redux state to the associated {@code Conference}'s props.
 *
 * @param {Object} state - The redux state.
 * @param {any} _ownProps - Component's own props.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state, _ownProps) {
    const { isOpen } = state['features/participants-pane'];
    const { aspectRatio, reducedUI } = state['features/base/responsive-ui'];
    const { backgroundColor } = state['features/dynamic-branding'];
    const { startCarMode } = state['features/base/settings'];
    const { enabled: audioOnlyEnabled } = state['features/base/audio-only'];
    const brandingStyles = backgroundColor ? {
        backgroundColor
    } : undefined;
    return {
        ...(0, AbstractConference_1.abstractMapStateToProps)(state),
        _aspectRatio: aspectRatio,
        _audioOnlyEnabled: Boolean(audioOnlyEnabled),
        _brandingStyles: brandingStyles,
        _calendarEnabled: (0, functions_native_1.isCalendarEnabled)(state),
        _connecting: (0, functions_native_4.isConnecting)(state),
        _filmstripVisible: (0, functions_native_2.isFilmstripVisible)(state),
        _fullscreenEnabled: (0, functions_1.getFeatureFlag)(state, constants_1.FULLSCREEN_ENABLED, true),
        _isParticipantsPaneOpen: isOpen,
        _largeVideoParticipantId: state['features/large-video'].participantId,
        _pictureInPictureEnabled: (0, functions_1.getFeatureFlag)(state, constants_1.PIP_ENABLED),
        _reducedUI: reducedUI,
        _showLobby: (0, functions_2.getIsLobbyVisible)(state),
        _startCarMode: startCarMode,
        _toolboxVisible: (0, functions_native_3.isToolboxVisible)(state)
    };
}
exports.default = (0, react_native_safe_area_context_1.withSafeAreaInsets)((0, react_redux_1.connect)(_mapStateToProps)(props => {
    const dispatch = (0, react_redux_1.useDispatch)();
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        dispatch({ type: actionTypes_1.CONFERENCE_FOCUSED });
        (0, functions_3.setPictureInPictureEnabled)(true);
        return () => {
            dispatch({ type: actionTypes_1.CONFERENCE_BLURRED });
            (0, functions_3.setPictureInPictureEnabled)(false);
        };
    }, []));
    return ( // @ts-ignore
    <Conference {...props}/>);
}));
