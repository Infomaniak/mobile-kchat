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
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/conference/functions");
const functions_2 = require("../../../base/i18n/functions");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const LoadingIndicator_1 = __importDefault(require("../../../base/react/components/native/LoadingIndicator"));
const constants_1 = require("../../../base/responsive-ui/constants");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const Input_1 = __importDefault(require("../../../base/ui/components/native/Input"));
const constants_native_1 = require("../../../base/ui/constants.native");
const BrandingImageBackground_1 = __importDefault(require("../../../dynamic-branding/components/native/BrandingImageBackground"));
const LargeVideo_native_1 = __importDefault(require("../../../large-video/components/LargeVideo.native"));
const LobbyNavigationContainerRef_1 = require("../../../mobile/navigation/components/lobby/LobbyNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const styles_1 = require("../../../prejoin/components/native/styles");
const AudioMuteButton_1 = __importDefault(require("../../../toolbox/components/native/AudioMuteButton"));
const VideoMuteButton_1 = __importDefault(require("../../../toolbox/components/native/VideoMuteButton"));
const AbstractLobbyScreen_1 = __importStar(require("../AbstractLobbyScreen"));
const styles_2 = __importDefault(require("./styles"));
/**
 * Implements a waiting screen that represents the participant being in the lobby.
 */
class LobbyScreen extends AbstractLobbyScreen_1.default {
    /**
     * Implements {@code PureComponent#render}.
     *
     * @inheritdoc
     */
    render() {
        const { _aspectRatio, _roomName } = this.props;
        let contentWrapperStyles;
        let contentContainerStyles;
        let largeVideoContainerStyles;
        if (_aspectRatio === constants_1.ASPECT_RATIO_NARROW) {
            contentWrapperStyles = styles_1.preJoinStyles.contentWrapper;
            largeVideoContainerStyles = styles_1.preJoinStyles.largeVideoContainer;
            contentContainerStyles = styles_2.default.contentContainer;
        }
        else {
            contentWrapperStyles = styles_1.preJoinStyles.contentWrapperWide;
            largeVideoContainerStyles = styles_1.preJoinStyles.largeVideoContainerWide;
            contentContainerStyles = styles_1.preJoinStyles.contentContainerWide;
        }
        return (<JitsiScreen_1.default safeAreaInsets={['right']} style={contentWrapperStyles}>
                <BrandingImageBackground_1.default />
                <react_native_1.View style={largeVideoContainerStyles}>
                    <react_native_1.View style={styles_1.preJoinStyles.displayRoomNameBackdrop}>
                        <react_native_1.Text numberOfLines={1} style={styles_1.preJoinStyles.preJoinRoomName}>
                            {_roomName}
                        </react_native_1.Text>
                    </react_native_1.View>
                    <LargeVideo_native_1.default />
                </react_native_1.View>
                <react_native_1.View style={contentContainerStyles}>
                    {this._renderToolbarButtons()}
                    {this._renderContent()}
                </react_native_1.View>
            </JitsiScreen_1.default>);
    }
    /**
     * Navigates to the lobby chat screen.
     *
     * @private
     * @returns {void}
     */
    _onNavigateToLobbyChat() {
        (0, LobbyNavigationContainerRef_1.navigate)(routes_1.screen.lobby.chat);
    }
    /**
     * Renders the joining (waiting) fragment of the screen.
     *
     * @inheritdoc
     */
    _renderJoining() {
        return (<react_native_1.View style={styles_2.default.lobbyWaitingFragmentContainer}>
                <react_native_1.Text style={styles_2.default.lobbyTitle}>
                    {this.props.t('lobby.joiningTitle')}
                </react_native_1.Text>
                <LoadingIndicator_1.default color={BaseTheme_native_1.default.palette.icon01} style={styles_2.default.loadingIndicator}/>
                <react_native_1.Text style={styles_2.default.joiningMessage}>
                    {this.props.t('lobby.joiningMessage')}
                </react_native_1.Text>
                {this._renderStandardButtons()}
            </react_native_1.View>);
    }
    /**
     * Renders the participant form to let the knocking participant enter its details.
     *
     * @inheritdoc
     */
    _renderParticipantForm() {
        const { t } = this.props;
        const { displayName } = this.state;
        return (<Input_1.default customStyles={{ input: styles_1.preJoinStyles.customInput }} onChange={this._onChangeDisplayName} placeholder={t('lobby.nameField')} value={displayName}/>);
    }
    /**
     * Renders the participant info fragment when we have all the required details of the user.
     *
     * @inheritdoc
     */
    _renderParticipantInfo() {
        return this._renderParticipantForm();
    }
    /**
     * Renders the password form to let the participant join by using a password instead of knocking.
     *
     * @inheritdoc
     */
    _renderPasswordForm() {
        const { _passwordJoinFailed, t } = this.props;
        return (<Input_1.default autoCapitalize='none' customStyles={{ input: styles_2.default.customInput }} error={_passwordJoinFailed} onChange={this._onChangePassword} placeholder={t('lobby.enterPasswordButton')} secureTextEntry={true} value={this.state.password}/>);
    }
    /**
     * Renders the password join button (set).
     *
     * @inheritdoc
     */
    _renderPasswordJoinButtons() {
        return (<react_native_1.View style={styles_2.default.passwordJoinButtons}>
                <Button_1.default accessibilityLabel='lobby.passwordJoinButton' disabled={!this.state.password} labelKey={'lobby.passwordJoinButton'} onClick={this._onJoinWithPassword} style={styles_1.preJoinStyles.joinButton} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>
                <Button_1.default accessibilityLabel='lobby.backToKnockModeButton' labelKey='lobby.backToKnockModeButton' onClick={this._onSwitchToKnockMode} style={styles_1.preJoinStyles.joinButton} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>
            </react_native_1.View>);
    }
    /**
     * Renders the toolbar buttons menu.
     *
     * @inheritdoc
     */
    _renderToolbarButtons() {
        return (<react_native_1.View style={styles_1.preJoinStyles.toolboxContainer}>
                <AudioMuteButton_1.default styles={styles_1.preJoinStyles.buttonStylesBorderless}/>
                <VideoMuteButton_1.default styles={styles_1.preJoinStyles.buttonStylesBorderless}/>
            </react_native_1.View>);
    }
    /**
     * Renders the standard button set.
     *
     * @inheritdoc
     */
    _renderStandardButtons() {
        const { _knocking, _renderPassword, _isLobbyChatActive } = this.props;
        const { displayName } = this.state;
        return (<react_native_1.View style={styles_2.default.formWrapper}>
                {_knocking && _isLobbyChatActive
                && <Button_1.default accessibilityLabel='toolbar.openChat' labelKey='toolbar.openChat' onClick={this._onNavigateToLobbyChat} style={styles_1.preJoinStyles.joinButton} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>}
                {_knocking
                || <Button_1.default accessibilityLabel='lobby.knockButton' disabled={!displayName} labelKey='lobby.knockButton' onClick={this._onAskToJoin} style={styles_1.preJoinStyles.joinButton} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>}
                {_renderPassword
                && <Button_1.default accessibilityLabel='lobby.enterPasswordButton' labelKey='lobby.enterPasswordButton' onClick={this._onSwitchToPasswordMode} style={styles_1.preJoinStyles.joinButton} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>}
            </react_native_1.View>);
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {{
 *     _aspectRatio: Symbol
 * }}
 */
function _mapStateToProps(state) {
    return {
        ...(0, AbstractLobbyScreen_1._mapStateToProps)(state),
        _aspectRatio: state['features/base/responsive-ui'].aspectRatio,
        _roomName: (0, functions_1.getConferenceName)(state)
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(LobbyScreen));
