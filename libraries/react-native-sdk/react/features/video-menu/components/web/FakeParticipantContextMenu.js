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
const TogglePinToStageButton_1 = __importDefault(require("../../../../features/video-menu/components/web/TogglePinToStageButton"));
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const svg_1 = require("../../../base/icons/svg");
const functions_1 = require("../../../base/participants/functions");
const ContextMenu_1 = __importDefault(require("../../../base/ui/components/web/ContextMenu"));
const ContextMenuItemGroup_1 = __importDefault(require("../../../base/ui/components/web/ContextMenuItemGroup"));
const actions_any_1 = require("../../../shared-video/actions.any");
const functions_web_1 = require("../../../toolbox/functions.web");
const types_1 = require("../../../toolbox/types");
const actions_1 = require("../../../whiteboard/actions");
const constants_1 = require("../../../whiteboard/constants");
const constants_2 = require("../../constants");
const FakeParticipantContextMenu = ({ className, closeDrawer, drawerParticipant, localVideoOwner, offsetTarget, onEnter, onLeave, onSelect, participant, thumbnailMenu }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const _overflowDrawer = (0, react_redux_1.useSelector)(functions_web_1.showOverflowDrawer);
    const buttonsWithNotifyClick = (0, react_redux_1.useSelector)(functions_web_1.getParticipantMenuButtonsWithNotifyClick);
    const notifyClick = (0, react_1.useCallback)((buttonKey, participantId) => {
        const notifyMode = buttonsWithNotifyClick?.get(buttonKey);
        if (!notifyMode) {
            return;
        }
        APP.API.notifyParticipantMenuButtonClicked(buttonKey, participantId, notifyMode === types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY);
    }, [buttonsWithNotifyClick]);
    const clickHandler = (0, react_1.useCallback)(() => onSelect(true), [onSelect]);
    const _onStopSharedVideo = (0, react_1.useCallback)(() => {
        clickHandler();
        dispatch((0, actions_any_1.stopSharedVideo)());
    }, [actions_any_1.stopSharedVideo]);
    const _onHideWhiteboard = (0, react_1.useCallback)(() => {
        clickHandler();
        dispatch((0, actions_1.setWhiteboardOpen)(false));
    }, [actions_1.setWhiteboardOpen]);
    const _getActions = (0, react_1.useCallback)(() => {
        if ((0, functions_1.isWhiteboardParticipant)(participant)) {
            return [{
                    accessibilityLabel: t('toolbar.hideWhiteboard'),
                    icon: svg_1.IconPlay,
                    onClick: _onHideWhiteboard,
                    text: t('toolbar.hideWhiteboard')
                }];
        }
        if (localVideoOwner) {
            return [{
                    accessibilityLabel: t('toolbar.stopSharedVideo'),
                    icon: svg_1.IconPlay,
                    onClick: _onStopSharedVideo,
                    text: t('toolbar.stopSharedVideo')
                }];
        }
    }, [localVideoOwner, participant.fakeParticipant]);
    return (react_1.default.createElement(ContextMenu_1.default, { className: className, entity: participant, hidden: thumbnailMenu ? false : undefined, inDrawer: thumbnailMenu && _overflowDrawer, isDrawerOpen: Boolean(drawerParticipant), offsetTarget: offsetTarget, onClick: onSelect, onDrawerClose: thumbnailMenu ? onSelect : closeDrawer, onMouseEnter: onEnter, onMouseLeave: onLeave },
        !thumbnailMenu && _overflowDrawer && drawerParticipant && react_1.default.createElement(ContextMenuItemGroup_1.default, { actions: [{
                    accessibilityLabel: drawerParticipant.displayName,
                    customIcon: react_1.default.createElement(Avatar_1.default, { participantId: drawerParticipant.participantID, size: 20 }),
                    text: drawerParticipant.displayName
                }] }),
        react_1.default.createElement(ContextMenuItemGroup_1.default, { actions: _getActions() }, (0, functions_1.isWhiteboardParticipant)(participant) && (react_1.default.createElement(TogglePinToStageButton_1.default, { key: 'pinToStage', 
            // eslint-disable-next-line react/jsx-no-bind
            notifyClick: () => notifyClick(constants_2.PARTICIPANT_MENU_BUTTONS.PIN_TO_STAGE, constants_1.WHITEBOARD_ID), notifyMode: buttonsWithNotifyClick?.get(constants_2.PARTICIPANT_MENU_BUTTONS.PIN_TO_STAGE), participantID: constants_1.WHITEBOARD_ID })))));
};
exports.default = FakeParticipantContextMenu;
