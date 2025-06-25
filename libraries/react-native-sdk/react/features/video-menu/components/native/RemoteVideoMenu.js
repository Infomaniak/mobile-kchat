"use strict";
/* eslint-disable lines-around-comment*/
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
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const actions_1 = require("../../../base/dialog/actions");
const BottomSheet_1 = __importDefault(require("../../../base/dialog/components/native/BottomSheet"));
const styles_1 = require("../../../base/dialog/components/native/styles");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const functions_2 = require("../../../base/i18n/functions");
const functions_3 = require("../../../base/participants/functions");
const functions_4 = require("../../../breakout-rooms/functions");
const PrivateMessageButton_1 = __importDefault(require("../../../chat/components/native/PrivateMessageButton"));
const AskUnmuteButton_1 = __importDefault(require("./AskUnmuteButton"));
const ConnectionStatusButton_1 = __importDefault(require("./ConnectionStatusButton"));
const DemoteToVisitorButton_1 = __importDefault(require("./DemoteToVisitorButton"));
const GrantModeratorButton_1 = __importDefault(require("./GrantModeratorButton"));
const KickButton_1 = __importDefault(require("./KickButton"));
const MuteButton_1 = __importDefault(require("./MuteButton"));
const MuteEveryoneElseButton_1 = __importDefault(require("./MuteEveryoneElseButton"));
const MuteVideoButton_1 = __importDefault(require("./MuteVideoButton"));
const PinButton_1 = __importDefault(require("./PinButton"));
const SendToBreakoutRoom_1 = __importDefault(require("./SendToBreakoutRoom"));
const VolumeSlider_1 = __importDefault(require("./VolumeSlider"));
const styles_2 = __importDefault(require("./styles"));
/**
 * Size of the rendered avatar in the menu.
 */
const AVATAR_SIZE = 24;
/**
 * Class to implement a popup menu that opens upon long pressing a thumbnail.
 */
class RemoteVideoMenu extends react_1.PureComponent {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onCancel = this._onCancel.bind(this);
        this._renderMenuHeader = this._renderMenuHeader.bind(this);
    }
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { _disableKick, _disablePrivateChat, _disableRemoteMute, _disableGrantModerator, _isBreakoutRoom, _isParticipantAvailable, _moderator, _rooms, _showDemote, _currentRoomId, participantId, t } = this.props;
        const buttonProps = {
            afterClick: this._onCancel,
            showLabel: true,
            participantID: participantId,
            styles: styles_1.bottomSheetStyles.buttons
        };
        const connectionStatusButtonProps = {
            ...buttonProps,
            afterClick: undefined
        };
        return (<BottomSheet_1.default renderHeader={this._renderMenuHeader} showSlidingView={_isParticipantAvailable}>
                <AskUnmuteButton_1.default {...buttonProps}/>
                {!_disableRemoteMute && <MuteButton_1.default {...buttonProps}/>}
                <MuteEveryoneElseButton_1.default {...buttonProps}/>
                {!_disableRemoteMute && <MuteVideoButton_1.default {...buttonProps}/>}
                {/* @ts-ignore */}
                <react_native_paper_1.Divider style={styles_2.default.divider}/>
                {!_disableKick && <KickButton_1.default {...buttonProps}/>}
                {!_disableGrantModerator && !_isBreakoutRoom && <GrantModeratorButton_1.default {...buttonProps}/>}
                <PinButton_1.default {...buttonProps}/>
                {_showDemote && <DemoteToVisitorButton_1.default {...buttonProps}/>}
                {!_disablePrivateChat && <PrivateMessageButton_1.default {...buttonProps}/>}
                <ConnectionStatusButton_1.default {...connectionStatusButtonProps}/>
                {_moderator && _rooms.length > 1 && <>
                    {/* @ts-ignore */}
                    <react_native_paper_1.Divider style={styles_2.default.divider}/>
                    <react_native_1.View style={styles_2.default.contextMenuItem}>
                        <react_native_1.Text style={styles_2.default.contextMenuItemText}>
                            {t('breakoutRooms.actions.sendToBreakoutRoom')}
                        </react_native_1.Text>
                    </react_native_1.View>
                    {_rooms.map(room => _currentRoomId !== room.id && (<SendToBreakoutRoom_1.default key={room.id} room={room} {...buttonProps}/>))}
                </>}
                <VolumeSlider_1.default participantID={participantId}/>
            </BottomSheet_1.default>);
    }
    /**
     * Callback to hide the {@code RemoteVideoMenu}.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel() {
        this.props.dispatch((0, actions_1.hideSheet)());
    }
    /**
     * Function to render the menu's header.
     *
     * @returns {React$Element}
     */
    _renderMenuHeader() {
        const { participantId } = this.props;
        return (<react_native_1.View style={[
                styles_1.bottomSheetStyles.sheet,
                styles_2.default.participantNameContainer
            ]}>
                <Avatar_1.default participantId={participantId} size={AVATAR_SIZE}/>
                <react_native_1.Text style={styles_2.default.participantNameLabel}>
                    {this.props._participantDisplayName}
                </react_native_1.Text>
            </react_native_1.View>);
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Object} ownProps - Properties of component.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const kickOutEnabled = (0, functions_1.getFeatureFlag)(state, constants_1.KICK_OUT_ENABLED, true);
    const { participantId } = ownProps;
    const { remoteVideoMenu = {}, disableRemoteMute } = state['features/base/config'];
    const isParticipantAvailable = (0, functions_3.getParticipantById)(state, participantId);
    const { disableKick, disablePrivateChat } = remoteVideoMenu;
    const _rooms = Object.values((0, functions_4.getBreakoutRooms)(state));
    const _currentRoomId = (0, functions_4.getCurrentRoomId)(state);
    const shouldDisableKick = disableKick || !kickOutEnabled;
    const moderator = (0, functions_3.isLocalParticipantModerator)(state);
    const _iAmVisitor = state['features/visitors'].iAmVisitor;
    const _isBreakoutRoom = (0, functions_4.isInBreakoutRoom)(state);
    return {
        _currentRoomId,
        _disableKick: Boolean(shouldDisableKick),
        _disableRemoteMute: Boolean(disableRemoteMute),
        _disablePrivateChat: Boolean(disablePrivateChat) || _iAmVisitor,
        _isBreakoutRoom,
        _isParticipantAvailable: Boolean(isParticipantAvailable),
        _moderator: moderator,
        _participantDisplayName: (0, functions_3.getParticipantDisplayName)(state, participantId),
        _rooms,
        _showDemote: moderator
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(RemoteVideoMenu));
