"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const excalidraw_1 = require("@jitsi/excalidraw");
const functions_1 = require("../base/conference/functions");
const actions_1 = require("../base/dialog/actions");
const functions_2 = require("../base/dialog/functions");
const actions_2 = require("../base/participants/actions");
const types_1 = require("../base/participants/types");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const functions_3 = require("../breakout-rooms/functions");
const actions_web_1 = require("../filmstrip/actions.web");
const functions_web_1 = require("../filmstrip/functions.web");
const actionTypes_1 = require("./actionTypes");
const actions_3 = require("./actions");
const WhiteboardLimitDialog_1 = __importDefault(require("./components/web/WhiteboardLimitDialog"));
const constants_1 = require("./constants");
const functions_4 = require("./functions");
const types_2 = require("./types");
require("./middleware.any");
const focusWhiteboard = (store) => {
    const { dispatch, getState } = store;
    const state = getState();
    const conference = (0, functions_1.getCurrentConference)(state);
    const stageFilmstrip = (0, functions_web_1.isStageFilmstripAvailable)(state);
    const isPresent = (0, functions_4.isWhiteboardPresent)(state);
    if (!isPresent) {
        dispatch((0, actions_2.participantJoined)({
            conference,
            fakeParticipant: types_1.FakeParticipant.Whiteboard,
            id: constants_1.WHITEBOARD_ID,
            name: constants_1.WHITEBOARD_PARTICIPANT_NAME
        }));
    }
    if (stageFilmstrip) {
        dispatch((0, actions_web_1.addStageParticipant)(constants_1.WHITEBOARD_ID, true));
    }
    else {
        dispatch((0, actions_2.pinParticipant)(constants_1.WHITEBOARD_ID));
    }
};
/**
 * Middleware which intercepts whiteboard actions to handle changes to the related state.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register((store) => (next) => async (action) => {
    const { dispatch, getState } = store;
    const state = getState();
    const conference = (0, functions_1.getCurrentConference)(state);
    switch (action.type) {
        case actionTypes_1.SET_WHITEBOARD_OPEN: {
            const existingCollabDetails = (0, functions_4.getCollabDetails)(state);
            const enforceUserLimit = (0, functions_4.shouldEnforceUserLimit)(state);
            const notifyUserLimit = (0, functions_4.shouldNotifyUserLimit)(state);
            if (enforceUserLimit) {
                dispatch((0, actions_3.restrictWhiteboard)(false));
                dispatch((0, actions_1.openDialog)(WhiteboardLimitDialog_1.default));
                return next(action);
            }
            if (!existingCollabDetails) {
                const collabLinkData = await (0, excalidraw_1.generateCollaborationLinkData)();
                const collabServerUrl = (0, functions_4.generateCollabServerUrl)(state);
                const roomId = (0, functions_3.getCurrentRoomId)(state);
                const collabData = {
                    collabDetails: {
                        roomId,
                        roomKey: collabLinkData.roomKey
                    },
                    collabServerUrl
                };
                focusWhiteboard(store);
                dispatch((0, actions_3.setupWhiteboard)(collabData));
                conference?.getMetadataHandler().setMetadata(constants_1.WHITEBOARD_ID, collabData);
                raiseWhiteboardNotification(types_2.WhiteboardStatus.INSTANTIATED);
                return next(action);
            }
            if (action.isOpen) {
                if (enforceUserLimit) {
                    dispatch((0, actions_3.restrictWhiteboard)());
                    return next(action);
                }
                if (notifyUserLimit) {
                    dispatch((0, actions_3.notifyWhiteboardLimit)());
                }
                if ((0, functions_2.isDialogOpen)(state, WhiteboardLimitDialog_1.default)) {
                    dispatch((0, actions_1.hideDialog)(WhiteboardLimitDialog_1.default));
                }
                focusWhiteboard(store);
                raiseWhiteboardNotification(types_2.WhiteboardStatus.SHOWN);
                return next(action);
            }
            dispatch((0, actions_2.participantLeft)(constants_1.WHITEBOARD_ID, conference, { fakeParticipant: types_1.FakeParticipant.Whiteboard }));
            raiseWhiteboardNotification(types_2.WhiteboardStatus.HIDDEN);
            break;
        }
        case actionTypes_1.RESET_WHITEBOARD: {
            dispatch((0, actions_2.participantLeft)(constants_1.WHITEBOARD_ID, conference, { fakeParticipant: types_1.FakeParticipant.Whiteboard }));
            raiseWhiteboardNotification(types_2.WhiteboardStatus.RESET);
            break;
        }
    }
    return next(action);
});
/**
 * Raises the whiteboard status notifications changes (if API is enabled).
 *
 * @param {WhiteboardStatus} status - The whiteboard changed status.
 * @returns {Function}
 */
function raiseWhiteboardNotification(status) {
    if (typeof APP !== 'undefined') {
        APP.API.notifyWhiteboardStatusChanged(status);
    }
}
