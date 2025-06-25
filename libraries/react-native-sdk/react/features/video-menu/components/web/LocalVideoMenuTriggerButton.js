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
const functions_web_1 = require("../../../base/settings/functions.web");
const functions_2 = require("../../../base/tracks/functions");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const ContextMenu_1 = __importDefault(require("../../../base/ui/components/web/ContextMenu"));
const ContextMenuItemGroup_1 = __importDefault(require("../../../base/ui/components/web/ContextMenuItemGroup"));
const ConnectionIndicatorContent_1 = __importDefault(require("../../../connection-indicator/components/web/ConnectionIndicatorContent"));
const constants_1 = require("../../../filmstrip/constants");
const functions_web_2 = require("../../../filmstrip/functions.web");
const functions_web_3 = require("../../../toolbox/functions.web");
const types_1 = require("../../../toolbox/types");
const actions_web_1 = require("../../actions.web");
const constants_2 = require("../../constants");
const ConnectionStatusButton_1 = __importDefault(require("./ConnectionStatusButton"));
const DemoteToVisitorButton_1 = __importDefault(require("./DemoteToVisitorButton"));
const FlipLocalVideoButton_1 = __importDefault(require("./FlipLocalVideoButton"));
const HideSelfViewVideoButton_1 = __importDefault(require("./HideSelfViewVideoButton"));
const TogglePinToStageButton_1 = __importDefault(require("./TogglePinToStageButton"));
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
            padding: '0',
            minWidth: '200px'
        },
        flipText: {
            marginLeft: '36px'
        }
    };
});
const LocalVideoMenuTriggerButton = ({ _localParticipantId, _menuPosition, _overflowDrawer, _showConnectionInfo, _showDemote, _showHideSelfViewButton, _showLocalVideoFlipButton, _showPinToStage, buttonVisible, dispatch, hidePopover, showPopover, popoverVisible }) => {
    const { classes } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    const buttonsWithNotifyClick = (0, react_redux_1.useSelector)(functions_web_3.getParticipantMenuButtonsWithNotifyClick);
    const visitorsSupported = (0, react_redux_1.useSelector)((state) => state['features/visitors'].supported);
    const notifyClick = (0, react_1.useCallback)((buttonKey) => {
        const notifyMode = buttonsWithNotifyClick?.get(buttonKey);
        if (!notifyMode) {
            return;
        }
        APP.API.notifyParticipantMenuButtonClicked(buttonKey, _localParticipantId, notifyMode === types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY);
    }, [buttonsWithNotifyClick]);
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
    const content = _showConnectionInfo
        ? react_1.default.createElement(ConnectionIndicatorContent_1.default, { participantId: _localParticipantId })
        : (react_1.default.createElement(ContextMenu_1.default, { className: classes.contextMenu, hidden: false, inDrawer: _overflowDrawer },
            react_1.default.createElement(ContextMenuItemGroup_1.default, null,
                _showLocalVideoFlipButton
                    && react_1.default.createElement(FlipLocalVideoButton_1.default, { className: _overflowDrawer ? classes.flipText : '', 
                        // eslint-disable-next-line react/jsx-no-bind
                        notifyClick: () => notifyClick(constants_2.PARTICIPANT_MENU_BUTTONS.FLIP_LOCAL_VIDEO), notifyMode: buttonsWithNotifyClick?.get(constants_2.PARTICIPANT_MENU_BUTTONS.FLIP_LOCAL_VIDEO), onClick: hidePopover }),
                _showHideSelfViewButton
                    && react_1.default.createElement(HideSelfViewVideoButton_1.default, { className: _overflowDrawer ? classes.flipText : '', 
                        // eslint-disable-next-line react/jsx-no-bind
                        notifyClick: () => notifyClick(constants_2.PARTICIPANT_MENU_BUTTONS.HIDE_SELF_VIEW), notifyMode: buttonsWithNotifyClick?.get(constants_2.PARTICIPANT_MENU_BUTTONS.HIDE_SELF_VIEW), onClick: hidePopover }),
                _showPinToStage && react_1.default.createElement(TogglePinToStageButton_1.default, { className: _overflowDrawer ? classes.flipText : '', noIcon: true, 
                    // eslint-disable-next-line react/jsx-no-bind
                    notifyClick: () => notifyClick(constants_2.PARTICIPANT_MENU_BUTTONS.PIN_TO_STAGE), notifyMode: buttonsWithNotifyClick?.get(constants_2.PARTICIPANT_MENU_BUTTONS.PIN_TO_STAGE), onClick: hidePopover, participantID: _localParticipantId }),
                _showDemote && visitorsSupported && react_1.default.createElement(DemoteToVisitorButton_1.default, { className: _overflowDrawer ? classes.flipText : '', noIcon: true, 
                    // eslint-disable-next-line react/jsx-no-bind
                    notifyClick: () => notifyClick(constants_2.PARTICIPANT_MENU_BUTTONS.DEMOTE), notifyMode: buttonsWithNotifyClick?.get(constants_2.PARTICIPANT_MENU_BUTTONS.DEMOTE), onClick: hidePopover, participantID: _localParticipantId }),
                (0, utils_1.isMobileBrowser)() && react_1.default.createElement(ConnectionStatusButton_1.default
                // eslint-disable-next-line react/jsx-no-bind
                , { 
                    // eslint-disable-next-line react/jsx-no-bind
                    notifyClick: () => notifyClick(constants_2.PARTICIPANT_MENU_BUTTONS.CONN_STATUS), notifyMode: buttonsWithNotifyClick?.get(constants_2.PARTICIPANT_MENU_BUTTONS.CONN_STATUS), participantID: _localParticipantId }))));
    return ((0, utils_1.isMobileBrowser)() || _showLocalVideoFlipButton || _showHideSelfViewButton
        ? react_1.default.createElement(Popover_web_1.default, { content: content, headingLabel: t('dialog.localUserControls'), id: 'local-video-menu-trigger', onPopoverClose: _onPopoverClose, onPopoverOpen: _onPopoverOpen, position: _menuPosition, visible: Boolean(popoverVisible) }, buttonVisible && !(0, utils_1.isMobileBrowser)() && (react_1.default.createElement(Button_1.default, { accessibilityLabel: t('dialog.localUserControls'), className: classes.triggerButton, icon: svg_1.IconDotsHorizontal, size: 'small' })))
        : null);
};
/**
 * Maps (parts of) the Redux state to the associated {@code LocalVideoMenuTriggerButton}'s props.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The own props of the component.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const { thumbnailType } = ownProps;
    const localParticipant = (0, functions_1.getLocalParticipant)(state);
    const { disableLocalVideoFlip, disableSelfViewSettings } = state['features/base/config'];
    const videoTrack = (0, functions_2.getLocalVideoTrack)(state['features/base/tracks']);
    const { overflowDrawer } = state['features/toolbox'];
    const { showConnectionInfo } = state['features/base/connection'];
    const showHideSelfViewButton = !disableSelfViewSettings && !(0, functions_web_1.getHideSelfView)(state);
    let _menuPosition;
    switch (thumbnailType) {
        case constants_1.THUMBNAIL_TYPE.TILE:
            _menuPosition = 'left-start';
            break;
        case constants_1.THUMBNAIL_TYPE.VERTICAL:
            _menuPosition = 'left-start';
            break;
        case constants_1.THUMBNAIL_TYPE.HORIZONTAL:
            _menuPosition = 'top-start';
            break;
        default:
            _menuPosition = 'auto';
    }
    return {
        _menuPosition,
        _showDemote: (0, functions_1.getParticipantCount)(state) > 1,
        _showLocalVideoFlipButton: !disableLocalVideoFlip && videoTrack?.videoType !== 'desktop',
        _showHideSelfViewButton: showHideSelfViewButton,
        _overflowDrawer: overflowDrawer,
        _localParticipantId: localParticipant?.id ?? '',
        _showConnectionInfo: Boolean(showConnectionInfo),
        _showPinToStage: (0, functions_web_2.isStageFilmstripAvailable)(state)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(LocalVideoMenuTriggerButton);
