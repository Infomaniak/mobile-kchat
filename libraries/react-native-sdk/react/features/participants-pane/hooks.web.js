"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useParticipantDrawer = exports.useLobbyActions = void 0;
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const actions_web_1 = require("../chat/actions.web");
const actions_web_2 = require("../lobby/actions.web");
/**
 * Hook used to create admit/reject lobby actions.
 *
 * @param {Object} participant - The participant for which the actions are created.
 * @param {Function} closeDrawer - Callback for closing the drawer.
 * @returns {Array<Function>}
 */
function useLobbyActions(participant, closeDrawer) {
    const dispatch = (0, react_redux_1.useDispatch)();
    return [
        (0, react_1.useCallback)(e => {
            e.stopPropagation();
            dispatch((0, actions_web_2.approveKnockingParticipant)(participant?.participantID ?? ''));
            closeDrawer?.();
        }, [dispatch, closeDrawer, participant?.participantID]),
        (0, react_1.useCallback)(() => {
            dispatch((0, actions_web_2.rejectKnockingParticipant)(participant?.participantID ?? ''));
            closeDrawer?.();
        }, [dispatch, closeDrawer, participant?.participantID]),
        (0, react_1.useCallback)(() => {
            dispatch((0, actions_web_1.handleLobbyChatInitialized)(participant?.participantID ?? ''));
        }, [dispatch, participant?.participantID])
    ];
}
exports.useLobbyActions = useLobbyActions;
/**
 * Hook used to create actions & state for opening a drawer.
 *
 * @returns {Array<any>}
 */
function useParticipantDrawer() {
    const [drawerParticipant, openDrawerForParticipant] = (0, react_1.useState)(null);
    const closeDrawer = (0, react_1.useCallback)(() => {
        openDrawerForParticipant(null);
    }, []);
    return [
        drawerParticipant,
        closeDrawer,
        openDrawerForParticipant
    ];
}
exports.useParticipantDrawer = useParticipantDrawer;
