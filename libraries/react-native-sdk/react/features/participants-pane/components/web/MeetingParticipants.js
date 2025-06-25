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
const actions_1 = require("../../../av-moderation/actions");
const participantsPaneTheme_json_1 = __importDefault(require("../../../base/components/themes/participantsPaneTheme.json"));
const constants_1 = require("../../../base/media/constants");
const functions_1 = require("../../../base/participants/functions");
const functions_web_1 = require("../../../base/styles/functions.web");
const Input_1 = __importDefault(require("../../../base/ui/components/web/Input"));
const useContextMenu_web_1 = __importDefault(require("../../../base/ui/hooks/useContextMenu.web"));
const strings_web_1 = require("../../../base/util/strings.web");
const functions_2 = require("../../../breakout-rooms/functions");
const functions_web_2 = require("../../../toolbox/functions.web");
const actions_web_1 = require("../../../video-menu/actions.web");
const functions_3 = require("../../functions");
const hooks_1 = require("../../hooks");
const RenameButton_1 = __importDefault(require("../breakout-rooms/components/web/RenameButton"));
const InviteButton_1 = require("./InviteButton");
const MeetingParticipantContextMenu_1 = __importDefault(require("./MeetingParticipantContextMenu"));
const MeetingParticipantItems_1 = __importDefault(require("./MeetingParticipantItems"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        headingW: {
            color: theme.palette.warning02
        },
        heading: {
            color: theme.palette.text02,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBold),
            marginBottom: theme.spacing(3),
            [`@media(max-width: ${participantsPaneTheme_json_1.default.MD_BREAKPOINT})`]: {
                ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBoldLarge)
            }
        },
        search: {
            margin: `${theme.spacing(3)} 0`,
            '& input': {
                textAlign: 'center',
                paddingRight: '16px'
            }
        }
    };
});
/**
 * Renders the MeetingParticipantList component.
 * NOTE: This component is not using useSelector on purpose. The child components MeetingParticipantItem
 * and MeetingParticipantContextMenu are using connect. Having those mixed leads to problems.
 * When this one was using useSelector and the other two were not -the other two were re-rendered before this one was
 * re-rendered, so when participant is leaving, we first re-render the item and menu components,
 * throwing errors (closing the page) before removing those components for the participant that left.
 *
 * @returns {ReactNode} - The component.
 */
function MeetingParticipants({ currentRoom, overflowDrawer, participantsCount, searchString, setSearchString, showInviteButton, sortedParticipantIds = [] }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [lowerMenu, , toggleMenu, menuEnter, menuLeave, raiseContext] = (0, useContextMenu_web_1.default)();
    const muteAudio = (0, react_1.useCallback)(id => () => {
        dispatch((0, actions_web_1.muteRemote)(id, constants_1.MEDIA_TYPE.AUDIO));
        dispatch((0, actions_1.rejectParticipantAudio)(id));
    }, [dispatch]);
    const stopVideo = (0, react_1.useCallback)(id => () => {
        dispatch((0, actions_web_1.muteRemote)(id, constants_1.MEDIA_TYPE.VIDEO));
        dispatch((0, actions_1.rejectParticipantVideo)(id));
    }, [dispatch]);
    const [drawerParticipant, closeDrawer, openDrawerForParticipant] = (0, hooks_1.useParticipantDrawer)();
    // FIXME:
    // It seems that useTranslation is not very scalable. Unmount 500 components that have the useTranslation hook is
    // taking more than 10s. To workaround the issue we need to pass the texts as props. This is temporary and dirty
    // solution!!!
    // One potential proper fix would be to use react-window component in order to lower the number of components
    // mounted.
    const participantActionEllipsisLabel = t('participantsPane.actions.moreParticipantOptions');
    const youText = t('chat.you');
    const isBreakoutRoom = (0, react_redux_1.useSelector)(functions_2.isInBreakoutRoom);
    const _isCurrentRoomRenamable = (0, react_redux_1.useSelector)(functions_3.isCurrentRoomRenamable);
    const { classes: styles } = useStyles();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("span", { "aria-level": 1, className: 'sr-only', role: 'heading' }, t('participantsPane.title')),
        react_1.default.createElement("div", { className: styles.heading },
            currentRoom?.name
                ? `${currentRoom.name} (${participantsCount})`
                : t('participantsPane.headings.participantsList', { count: participantsCount }),
            currentRoom?.name && _isCurrentRoomRenamable
                && react_1.default.createElement(RenameButton_1.default, { breakoutRoomJid: currentRoom?.jid, name: currentRoom?.name })),
        showInviteButton && react_1.default.createElement(InviteButton_1.InviteButton, null),
        react_1.default.createElement(Input_1.default, { accessibilityLabel: t('participantsPane.search'), className: styles.search, clearable: true, id: 'participants-search-input', onChange: setSearchString, placeholder: t('participantsPane.search'), value: searchString }),
        react_1.default.createElement("div", null,
            react_1.default.createElement(MeetingParticipantItems_1.default, { isInBreakoutRoom: isBreakoutRoom, lowerMenu: lowerMenu, muteAudio: muteAudio, openDrawerForParticipant: openDrawerForParticipant, overflowDrawer: overflowDrawer, participantActionEllipsisLabel: participantActionEllipsisLabel, participantIds: sortedParticipantIds, raiseContextId: raiseContext.entity, searchString: (0, strings_web_1.normalizeAccents)(searchString), stopVideo: stopVideo, toggleMenu: toggleMenu, youText: youText })),
        react_1.default.createElement(MeetingParticipantContextMenu_1.default, { closeDrawer: closeDrawer, drawerParticipant: drawerParticipant, muteAudio: muteAudio, offsetTarget: raiseContext?.offsetTarget, onEnter: menuEnter, onLeave: menuLeave, onSelect: lowerMenu, overflowDrawer: overflowDrawer, participantID: raiseContext?.entity })));
}
/**
 * Maps (parts of) the redux state to the associated props for this component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The own props of the component.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    let sortedParticipantIds = (0, functions_3.getSortedParticipantIds)(state);
    // Filter out the virtual screenshare participants since we do not want them to be displayed as separate
    // participants in the participants pane.
    sortedParticipantIds = sortedParticipantIds.filter((id) => {
        const participant = (0, functions_1.getParticipantById)(state, id);
        return !(0, functions_1.isScreenShareParticipant)(participant);
    });
    const participantsCount = sortedParticipantIds.length;
    const showInviteButton = (0, functions_3.shouldRenderInviteButton)(state) && (0, functions_web_2.isButtonEnabled)('invite', state);
    const overflowDrawer = (0, functions_web_2.showOverflowDrawer)(state);
    const currentRoomId = (0, functions_2.getCurrentRoomId)(state);
    const currentRoom = (0, functions_2.getBreakoutRooms)(state)[currentRoomId];
    return {
        currentRoom,
        overflowDrawer,
        participantsCount,
        showInviteButton,
        sortedParticipantIds
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(MeetingParticipants);
