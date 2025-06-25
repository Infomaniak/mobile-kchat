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
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/dialog/actions");
const BottomSheet_1 = __importDefault(require("../../../base/dialog/components/native/BottomSheet"));
const styles_1 = require("../../../base/dialog/components/native/styles");
const SettingsButton_1 = __importDefault(require("../../../base/settings/components/native/SettingsButton"));
const BreakoutRoomsButton_1 = __importDefault(require("../../../breakout-rooms/components/native/BreakoutRoomsButton"));
const SharedDocumentButton_native_1 = __importDefault(require("../../../etherpad/components/SharedDocumentButton.native"));
const actions_2 = require("../../../mobile/external-api/actions");
const ReactionMenu_1 = __importDefault(require("../../../reactions/components/native/ReactionMenu"));
const functions_any_1 = require("../../../reactions/functions.any");
const LiveStreamButton_1 = __importDefault(require("../../../recording/components/LiveStream/native/LiveStreamButton"));
const RecordButton_1 = __importDefault(require("../../../recording/components/Recording/native/RecordButton"));
const SecurityDialogButton_1 = __importDefault(require("../../../security/components/security-dialog/native/SecurityDialogButton"));
const SharedVideoButton_1 = __importDefault(require("../../../shared-video/components/native/SharedVideoButton"));
const SpeakerStatsButton_1 = __importDefault(require("../../../speaker-stats/components/native/SpeakerStatsButton"));
const functions_1 = require("../../../speaker-stats/functions");
const ClosedCaptionButton_1 = __importDefault(require("../../../subtitles/components/native/ClosedCaptionButton"));
const TileViewButton_1 = __importDefault(require("../../../video-layout/components/TileViewButton"));
const styles_2 = __importDefault(require("../../../video-menu/components/native/styles"));
const WhiteboardButton_1 = __importDefault(require("../../../whiteboard/components/native/WhiteboardButton"));
const functions_native_1 = require("../../functions.native");
const AudioOnlyButton_1 = __importDefault(require("./AudioOnlyButton"));
const CustomOptionButton_1 = __importDefault(require("./CustomOptionButton"));
const LinkToSalesforceButton_1 = __importDefault(require("./LinkToSalesforceButton"));
const OpenCarmodeButton_1 = __importDefault(require("./OpenCarmodeButton"));
const RaiseHandButton_1 = __importDefault(require("./RaiseHandButton"));
const ScreenSharingButton_1 = __importDefault(require("./ScreenSharingButton"));
/**
 * Implements a React {@code Component} with some extra actions in addition to
 * those in the toolbar.
 */
class OverflowMenu extends react_1.PureComponent {
    /**
     * Initializes a new {@code OverflowMenu} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            scrolledToTop: true
        };
        // Bind event handlers so they are only bound once per instance.
        this._onCancel = this._onCancel.bind(this);
        this._renderReactionMenu = this._renderReactionMenu.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _isBreakoutRoomsSupported, _isSpeakerStatsDisabled, _shouldDisplayReactionsButtons, _width, dispatch } = this.props;
        const toolbarButtons = (0, functions_native_1.getMovableButtons)(_width);
        const buttonProps = {
            afterClick: this._onCancel,
            showLabel: true,
            styles: styles_1.bottomSheetStyles.buttons
        };
        const topButtonProps = {
            afterClick: this._onCancel,
            dispatch,
            showLabel: true,
            styles: {
                ...styles_1.bottomSheetStyles.buttons,
                style: {
                    ...styles_1.bottomSheetStyles.buttons.style,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16
                }
            }
        };
        return (<BottomSheet_1.default renderFooter={_shouldDisplayReactionsButtons && !toolbarButtons.has('raisehand')
                ? this._renderReactionMenu
                : undefined}>
                {this._renderCustomOverflowMenuButtons(topButtonProps)}
                <OpenCarmodeButton_1.default {...topButtonProps}/>
                <AudioOnlyButton_1.default {...buttonProps}/>
                {!_shouldDisplayReactionsButtons && !toolbarButtons.has('raisehand')
                && <RaiseHandButton_1.default {...buttonProps}/>}
                {/* @ts-ignore */}
                <react_native_paper_1.Divider style={styles_2.default.divider}/>
                <SecurityDialogButton_1.default {...buttonProps}/>
                <RecordButton_1.default {...buttonProps}/>
                <LiveStreamButton_1.default {...buttonProps}/>
                <LinkToSalesforceButton_1.default {...buttonProps}/>
                <WhiteboardButton_1.default {...buttonProps}/>
                {/* @ts-ignore */}
                <react_native_paper_1.Divider style={styles_2.default.divider}/>
                <SharedVideoButton_1.default {...buttonProps}/>
                {!toolbarButtons.has('screensharing') && <ScreenSharingButton_1.default {...buttonProps}/>}
                {!_isSpeakerStatsDisabled && <SpeakerStatsButton_1.default {...buttonProps}/>}
                {!toolbarButtons.has('tileview') && <TileViewButton_1.default {...buttonProps}/>}
                {_isBreakoutRoomsSupported && <BreakoutRoomsButton_1.default {...buttonProps}/>}
                {/* @ts-ignore */}
                <react_native_paper_1.Divider style={styles_2.default.divider}/>
                <ClosedCaptionButton_1.default {...buttonProps}/>
                <SharedDocumentButton_native_1.default {...buttonProps}/>
                <SettingsButton_1.default {...buttonProps}/>
            </BottomSheet_1.default>);
    }
    /**
     * Hides this {@code OverflowMenu}.
     *
     * @private
     * @returns {void}
     */
    _onCancel() {
        this.props.dispatch((0, actions_1.hideSheet)());
    }
    /**
     * Function to render the reaction menu as the footer of the bottom sheet.
     *
     * @returns {React.ReactElement}
     */
    _renderReactionMenu() {
        return (<ReactionMenu_1.default onCancel={this._onCancel} overflowMenu={true}/>);
    }
    /**
     * Function to render the custom buttons for the overflow menu.
     *
     * @param {Object} topButtonProps - Button properties.
     * @returns {React.ReactElement}
     */
    _renderCustomOverflowMenuButtons(topButtonProps) {
        const { _customToolbarButtons, dispatch } = this.props;
        if (!_customToolbarButtons?.length) {
            return;
        }
        return (<>
                {_customToolbarButtons.map(({ id, text, icon, ...rest }) => (<CustomOptionButton_1.default {...rest} {...topButtonProps} 
            /* eslint-disable react/jsx-no-bind */
            handleClick={() => dispatch((0, actions_2.customOverflowMenuButtonPressed)(id, text))} icon={icon} key={id} text={text}/>))}
                <react_native_paper_1.Divider style={styles_2.default.divider}/>
            </>);
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { conference } = state['features/base/conference'];
    const { customToolbarButtons } = state['features/base/config'];
    return {
        _customToolbarButtons: customToolbarButtons,
        _isBreakoutRoomsSupported: conference?.getBreakoutRooms()?.isSupported(),
        _isSpeakerStatsDisabled: (0, functions_1.isSpeakerStatsDisabled)(state),
        _shouldDisplayReactionsButtons: (0, functions_any_1.shouldDisplayReactionsButtons)(state),
        _width: state['features/base/responsive-ui'].clientWidth
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(OverflowMenu);
