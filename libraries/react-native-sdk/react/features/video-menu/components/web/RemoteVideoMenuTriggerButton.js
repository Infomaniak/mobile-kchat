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
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const utils_1 = require("../../../base/environment/utils");
const svg_1 = require("../../../base/icons/svg");
const functions_1 = require("../../../base/participants/functions");
const Popover_web_1 = __importDefault(require("../../../base/popover/components/Popover.web"));
const actions_1 = require("../../../base/responsive-ui/actions");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const ConnectionIndicatorContent_1 = __importDefault(require("../../../connection-indicator/components/web/ConnectionIndicatorContent"));
const constants_1 = require("../../../filmstrip/constants");
const actions_web_1 = require("../../actions.web");
const FakeParticipantContextMenu_1 = __importDefault(require("./FakeParticipantContextMenu"));
const ParticipantContextMenu_1 = __importDefault(require("./ParticipantContextMenu"));
const RemoteControlButton_1 = require("./RemoteControlButton");
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        triggerButton: {
            padding: '3px !important',
            borderRadius: '4px',
            '& svg': {
                width: '18px',
                height: '18px'
            }
        },
        contextMenu: {
            position: 'relative',
            marginTop: 0,
            right: 'auto',
            marginRight: '4px',
            marginBottom: '4px'
        }
    };
});
const RemoteVideoMenuTriggerButton = ({ _disabled, _localVideoOwner, _menuPosition, _participant, _participantDisplayName, _remoteControlState, _showConnectionInfo, buttonVisible, dispatch, hidePopover, participantID, popoverVisible, showPopover }) => {
    const { classes } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    const _onPopoverOpen = (0, react_1.useCallback)(() => {
        showPopover?.();
        dispatch((0, actions_1.setParticipantContextMenuOpen)(true));
    }, []);
    const _onPopoverClose = (0, react_1.useCallback)(() => {
        hidePopover?.();
        (0, react_redux_1.batch)(() => {
            dispatch((0, actions_1.setParticipantContextMenuOpen)(false));
            dispatch((0, actions_web_1.renderConnectionStatus)(false));
        });
    }, []);
    // eslint-disable-next-line react/no-multi-comp
    const _renderRemoteVideoMenu = () => {
        const props = {
            className: classes.contextMenu,
            onSelect: _onPopoverClose,
            participant: _participant,
            thumbnailMenu: true
        };
        if (_participant?.fakeParticipant) {
            return (react_1.default.createElement(FakeParticipantContextMenu_1.default, { ...props, localVideoOwner: _localVideoOwner }));
        }
        return (react_1.default.createElement(ParticipantContextMenu_1.default, { ...props, remoteControlState: _remoteControlState }));
    };
    let content;
    if (_showConnectionInfo) {
        content = react_1.default.createElement(ConnectionIndicatorContent_1.default, { participantId: participantID });
    }
    else if (!_disabled) {
        content = _renderRemoteVideoMenu();
    }
    if (!content) {
        return null;
    }
    const username = _participantDisplayName;
    return (react_1.default.createElement(Popover_web_1.default, { content: content, headingLabel: t('dialog.remoteUserControls', { username }), id: 'remote-video-menu-trigger', onPopoverClose: _onPopoverClose, onPopoverOpen: _onPopoverOpen, position: _menuPosition, visible: Boolean(popoverVisible) }, buttonVisible && !_disabled && (!(0, utils_1.isMobileBrowser)() && react_1.default.createElement(Button_1.default, { accessibilityLabel: t('dialog.remoteUserControls', { username }), className: classes.triggerButton, icon: svg_1.IconDotsHorizontal, size: 'small' }))));
};
/**
 * Maps (parts of) the Redux state to the associated {@code RemoteVideoMenuTriggerButton}'s props.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The own props of the component.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const { participantID, thumbnailType } = ownProps;
    let _remoteControlState;
    const localParticipantId = (0, functions_1.getLocalParticipant)(state)?.id;
    const participant = (0, functions_1.getParticipantById)(state, participantID ?? '');
    const _participantDisplayName = participant?.name;
    const _isRemoteControlSessionActive = participant?.remoteControlSessionStatus ?? false;
    const _supportsRemoteControl = participant?.supportsRemoteControl ?? false;
    const { active, controller } = state['features/remote-control'];
    const { requestedParticipant, controlled } = controller;
    const activeParticipant = requestedParticipant || controlled;
    const { showConnectionInfo } = state['features/base/connection'];
    const { remoteVideoMenu } = state['features/base/config'];
    const { ownerId } = state['features/shared-video'];
    if (_supportsRemoteControl
        && ((!active && !_isRemoteControlSessionActive) || activeParticipant === participantID)) {
        if (requestedParticipant === participantID) {
            _remoteControlState = RemoteControlButton_1.REMOTE_CONTROL_MENU_STATES.REQUESTING;
        }
        else if (controlled) {
            _remoteControlState = RemoteControlButton_1.REMOTE_CONTROL_MENU_STATES.STARTED;
        }
        else {
            _remoteControlState = RemoteControlButton_1.REMOTE_CONTROL_MENU_STATES.NOT_STARTED;
        }
    }
    let _menuPosition;
    switch (thumbnailType) {
        case constants_1.THUMBNAIL_TYPE.TILE:
            _menuPosition = 'left-start';
            break;
        case constants_1.THUMBNAIL_TYPE.VERTICAL:
            _menuPosition = 'left-end';
            break;
        case constants_1.THUMBNAIL_TYPE.HORIZONTAL:
            _menuPosition = 'top';
            break;
        default:
            _menuPosition = 'auto';
    }
    return {
        _disabled: Boolean(remoteVideoMenu?.disabled),
        _localVideoOwner: Boolean(ownerId === localParticipantId),
        _menuPosition,
        _participant: participant ?? { id: '' },
        _participantDisplayName: _participantDisplayName ?? '',
        _remoteControlState,
        _showConnectionInfo: Boolean(showConnectionInfo)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(RemoteVideoMenuTriggerButton);
