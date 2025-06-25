"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_native_1 = require("../../app/functions.native");
const functions_1 = require("../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../base/icons/components/Icon"));
const svg_1 = require("../../base/icons/svg");
const LoadingIndicator_1 = __importDefault(require("../../base/react/components/native/LoadingIndicator"));
const Text_1 = __importDefault(require("../../base/react/components/native/Text"));
const BaseTheme_native_1 = __importDefault(require("../../base/ui/components/BaseTheme.native"));
const Button_1 = __importDefault(require("../../base/ui/components/native/Button"));
const Input_1 = __importDefault(require("../../base/ui/components/native/Input"));
const constants_native_1 = require("../../base/ui/constants.native");
const getUnsafeRoomText_native_1 = __importDefault(require("../../base/util/getUnsafeRoomText.native"));
const WelcomePageTabs_1 = __importDefault(require("../../mobile/navigation/components/welcome/components/WelcomePageTabs"));
const AbstractWelcomePage_1 = require("./AbstractWelcomePage");
const styles_native_1 = __importDefault(require("./styles.native"));
/**
 * The native container rendering the welcome page.
 *
 * @augments AbstractWelcomePage
 */
class WelcomePage extends AbstractWelcomePage_1.AbstractWelcomePage {
    /**
     * Constructor of the Component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state._fieldFocused = false;
        this.state.isSettingsScreenFocused = false;
        this.state.roomNameInputAnimation = new react_native_1.Animated.Value(1);
        this.state.hintBoxAnimation = new react_native_1.Animated.Value(0);
        // Bind event handlers so they are only bound once per instance.
        this._onFieldFocusChange = this._onFieldFocusChange.bind(this);
        this._renderHintBox = this._renderHintBox.bind(this);
        // Specially bind functions to avoid function definition on render.
        this._onFieldBlur = this._onFieldFocusChange.bind(this, false);
        this._onFieldFocus = this._onFieldFocusChange.bind(this, true);
        this._onSettingsScreenFocused = this._onSettingsScreenFocused.bind(this);
    }
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs. Creates a local video track if none
     * is available and the camera permission was already granted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        super.componentDidMount();
        const { navigation, t } = this.props;
        navigation.setOptions({
            headerTitle: t('welcomepage.headerTitle')
        });
        navigation.addListener('focus', () => {
            this._updateRoomName();
        });
        navigation.addListener('blur', () => {
            this._clearTimeouts();
            this.setState({
                generatedRoomName: '',
                insecureRoomName: false,
                room: ''
            });
        });
    }
    /**
     * Implements React's {@link Component#render()}. Renders a prompt for
     * entering a room name.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        // We want to have the welcome page support the reduced UI layout,
        // but we ran into serious issues enabling it so we disable it
        // until we have a proper fix in place. We leave the code here though, because
        // this part should be fine when the bug is fixed.
        //
        // NOTE: when re-enabling, don't forget to uncomment the respective _mapStateToProps line too
        /*
        const { _reducedUI } = this.props;

        if (_reducedUI) {
            return this._renderReducedUI();
        }
        */
        return this._renderFullUI();
    }
    /**
     * Renders the insecure room name warning.
     *
     * @inheritdoc
     */
    _doRenderInsecureRoomNameWarning() {
        return (<react_native_1.View style={[
                styles_native_1.default.messageContainer,
                styles_native_1.default.insecureRoomNameWarningContainer
            ]}>
                <Icon_1.default src={svg_1.IconWarning} style={styles_native_1.default.insecureRoomNameWarningIcon}/>
                <Text_1.default style={styles_native_1.default.insecureRoomNameWarningText}>
                    {this.props.getUnsafeRoomTextFn(this.props.t)}
                </Text_1.default>
            </react_native_1.View>);
    }
    /**
     * Constructs a style array to handle the hint box animation.
     *
     * @private
     * @returns {Array<Object>}
     */
    _getHintBoxStyle() {
        return [
            styles_native_1.default.messageContainer,
            styles_native_1.default.hintContainer,
            {
                opacity: this.state.hintBoxAnimation
            }
        ];
    }
    /**
     * Callback for when the room field's focus changes so the hint box
     * must be rendered or removed.
     *
     * @private
     * @param {boolean} focused - The focused state of the field.
     * @returns {void}
     */
    _onFieldFocusChange(focused) {
        if (focused) {
            // Stop placeholder animation.
            this._clearTimeouts();
            this.setState({
                _fieldFocused: true,
                roomPlaceholder: ''
            });
        }
        else {
            // Restart room placeholder animation.
            this._updateRoomName();
        }
        react_native_1.Animated.timing(this.state.hintBoxAnimation, {
            duration: 300,
            toValue: focused ? 1 : 0,
            useNativeDriver: true
        })
            .start(animationState => animationState.finished
            && !focused
            && this.setState({
                _fieldFocused: false
            }));
    }
    /**
     * Callback for when the settings screen is focused.
     *
     * @private
     * @param {boolean} focused - The focused state of the screen.
     * @returns {void}
     */
    _onSettingsScreenFocused(focused) {
        this.setState({
            isSettingsScreenFocused: focused
        });
        this.props.navigation.setOptions({
            headerShown: !focused
        });
        react_native_1.Animated.timing(this.state.roomNameInputAnimation, {
            toValue: focused ? 0 : 1,
            duration: 500,
            useNativeDriver: true
        })
            .start();
    }
    /**
     * Renders the hint box if necessary.
     *
     * @private
     * @returns {React$Node}
     */
    _renderHintBox() {
        const { t } = this.props;
        if (this.state._fieldFocused) {
            return (<react_native_1.Animated.View style={this._getHintBoxStyle()}>
                    <react_native_1.View style={styles_native_1.default.hintTextContainer}>
                        <Text_1.default style={styles_native_1.default.hintText}>
                            {t('welcomepage.roomnameHint')}
                        </Text_1.default>
                    </react_native_1.View>
                    <react_native_1.View style={styles_native_1.default.hintButtonContainer}>
                        {this._renderJoinButton()}
                    </react_native_1.View>
                </react_native_1.Animated.View>);
        }
        return null;
    }
    /**
     * Renders the join button.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderJoinButton() {
        const { t } = this.props;
        let joinButton;
        if (this.state.joining) {
            // TouchableHighlight is picky about what its children can be, so
            // wrap it in a native component, i.e. View to avoid having to
            // modify non-native children.
            joinButton = (<react_native_1.TouchableHighlight accessibilityLabel={t('welcomepage.accessibilityLabel.join')} onPress={this._onJoin} style={styles_native_1.default.button}>
                    <react_native_1.View>
                        <LoadingIndicator_1.default color={BaseTheme_native_1.default.palette.icon01} size='small'/>
                    </react_native_1.View>
                </react_native_1.TouchableHighlight>);
        }
        else {
            joinButton = (<Button_1.default accessibilityLabel={'welcomepage.accessibilityLabel.join'} labelKey={'welcomepage.join'} labelStyle={styles_native_1.default.joinButtonLabel} onClick={this._onJoin} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>);
        }
        return joinButton;
    }
    /**
     * Renders the room name input.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderRoomNameInput() {
        const roomnameAccLabel = 'welcomepage.accessibilityLabel.roomname';
        const { t } = this.props;
        const { isSettingsScreenFocused } = this.state;
        return (<react_native_1.Animated.View style={[
                isSettingsScreenFocused && styles_native_1.default.roomNameInputContainer,
                { opacity: this.state.roomNameInputAnimation }
            ]}>
                <react_native_1.SafeAreaView style={styles_native_1.default.roomContainer}>
                    <react_native_1.View style={styles_native_1.default.joinControls}>
                        <Text_1.default style={styles_native_1.default.enterRoomText}>
                            {t('welcomepage.roomname')}
                        </Text_1.default>
                        <Input_1.default accessibilityLabel={t(roomnameAccLabel)} autoCapitalize={'none'} autoFocus={false} customStyles={{ input: styles_native_1.default.customInput }} onBlur={this._onFieldBlur} onChange={this._onRoomChange} onFocus={this._onFieldFocus} onSubmitEditing={this._onJoin} placeholder={this.state.roomPlaceholder} returnKeyType={'go'} value={this.state.room}/>
                        {this._renderInsecureRoomNameWarning()}
                        {this._renderHintBox()}
                    </react_native_1.View>
                </react_native_1.SafeAreaView>
            </react_native_1.Animated.View>);
    }
    /**
     * Renders the full welcome page.
     *
     * @returns {ReactElement}
     */
    _renderFullUI() {
        return (<>
                {this._renderRoomNameInput()}
                <react_native_1.View style={styles_native_1.default.welcomePage}>
                    <WelcomePageTabs_1.default disabled={Boolean(this.state._fieldFocused)} // @ts-ignore
         onListContainerPress={this._onFieldBlur} onSettingsScreenFocused={this._onSettingsScreenFocused}/>
                </react_native_1.View>
            </>);
    }
    /**
     * Renders a "reduced" version of the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderReducedUI() {
        const { t } = this.props;
        return (<react_native_1.View style={styles_native_1.default.reducedUIContainer}>
                <Text_1.default style={styles_native_1.default.reducedUIText}>
                    {t('welcomepage.reducedUIText', { app: (0, functions_native_1.getName)() })}
                </Text_1.default>
            </react_native_1.View>);
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Object}
 */
function _mapStateToProps(state) {
    return {
        ...(0, AbstractWelcomePage_1._mapStateToProps)(state),
        // _reducedUI: state['features/base/responsive-ui'].reducedUI
        getUnsafeRoomTextFn: (t) => (0, getUnsafeRoomText_native_1.default)(state, t, 'welcome')
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(WelcomePage));
