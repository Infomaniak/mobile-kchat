"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const react_redux_1 = require("react-redux");
const ColorSchemeRegistry_1 = __importDefault(require("../../../base/color-scheme/ColorSchemeRegistry"));
const Platform_native_1 = __importDefault(require("../../../base/react/Platform.native"));
const ChatButton_1 = __importDefault(require("../../../chat/components/native/ChatButton"));
const ReactionsMenuButton_1 = __importDefault(require("../../../reactions/components/native/ReactionsMenuButton"));
const functions_any_1 = require("../../../reactions/functions.any");
const TileViewButton_1 = __importDefault(require("../../../video-layout/components/TileViewButton"));
const functions_1 = require("../../../visitors/functions");
const functions_native_1 = require("../../functions.native");
const HangupButton_1 = __importDefault(require("../HangupButton"));
const AudioMuteButton_1 = __importDefault(require("./AudioMuteButton"));
const HangupMenuButton_1 = __importDefault(require("./HangupMenuButton"));
const OverflowMenuButton_1 = __importDefault(require("./OverflowMenuButton"));
const RaiseHandButton_1 = __importDefault(require("./RaiseHandButton"));
const ScreenSharingButton_1 = __importDefault(require("./ScreenSharingButton"));
const VideoMuteButton_1 = __importDefault(require("./VideoMuteButton"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements the conference Toolbox on React Native.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$Element}
 */
function Toolbox(props) {
    const { _endConferenceSupported, _shouldDisplayReactionsButtons, _styles, _visible, _iAmVisitor, _width } = props;
    if (!_visible) {
        return null;
    }
    const bottomEdge = Platform_native_1.default.OS === 'ios' && _visible;
    const { buttonStylesBorderless, hangupButtonStyles, toggledButtonStyles } = _styles;
    const additionalButtons = (0, functions_native_1.getMovableButtons)(_width);
    const backgroundToggledStyle = {
        ...toggledButtonStyles,
        style: [
            toggledButtonStyles.style,
            _styles.backgroundToggle
        ]
    };
    const style = { ...styles_1.default.toolbox };
    // we have only hangup and raisehand button in _iAmVisitor mode
    if (_iAmVisitor) {
        additionalButtons.add('raisehand');
        style.justifyContent = 'center';
    }
    return (<react_native_1.View style={styles_1.default.toolboxContainer}>
            <react_native_safe_area_context_1.SafeAreaView accessibilityRole='toolbar' 
    // @ts-ignore
    edges={[bottomEdge && 'bottom'].filter(Boolean)} pointerEvents='box-none' style={style}>
                {!_iAmVisitor && <AudioMuteButton_1.default styles={buttonStylesBorderless} toggledStyles={toggledButtonStyles}/>}
                {!_iAmVisitor && <VideoMuteButton_1.default styles={buttonStylesBorderless} toggledStyles={toggledButtonStyles}/>}
                {additionalButtons.has('chat')
            && <ChatButton_1.default styles={buttonStylesBorderless} toggledStyles={backgroundToggledStyle}/>}
                {!_iAmVisitor && additionalButtons.has('screensharing')
            && <ScreenSharingButton_1.default styles={buttonStylesBorderless}/>}
                {additionalButtons.has('raisehand') && (_shouldDisplayReactionsButtons
            ? <ReactionsMenuButton_1.default styles={buttonStylesBorderless} toggledStyles={backgroundToggledStyle}/>
            : <RaiseHandButton_1.default styles={buttonStylesBorderless} toggledStyles={backgroundToggledStyle}/>)}
                {additionalButtons.has('tileview') && <TileViewButton_1.default styles={buttonStylesBorderless}/>}
                {!_iAmVisitor && <OverflowMenuButton_1.default styles={buttonStylesBorderless} toggledStyles={toggledButtonStyles}/>}
                {_endConferenceSupported
            ? <HangupMenuButton_1.default />
            : <HangupButton_1.default styles={hangupButtonStyles}/>}
            </react_native_safe_area_context_1.SafeAreaView>
        </react_native_1.View>);
}
/**
 * Maps parts of the redux state to {@link Toolbox} (React {@code Component})
 * props.
 *
 * @param {Object} state - The redux state of which parts are to be mapped to
 * {@code Toolbox} props.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { conference } = state['features/base/conference'];
    const endConferenceSupported = conference?.isEndConferenceSupported();
    return {
        _endConferenceSupported: Boolean(endConferenceSupported),
        _styles: ColorSchemeRegistry_1.default.get(state, 'Toolbox'),
        _visible: (0, functions_native_1.isToolboxVisible)(state),
        _iAmVisitor: (0, functions_1.iAmVisitor)(state),
        _width: state['features/base/responsive-ui'].clientWidth,
        _shouldDisplayReactionsButtons: (0, functions_any_1.shouldDisplayReactionsButtons)(state)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(Toolbox);
