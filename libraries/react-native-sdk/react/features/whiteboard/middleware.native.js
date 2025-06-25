"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../base/dialog/actions");
const functions_1 = require("../base/dialog/functions");
const functions_2 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const ConferenceNavigationContainerRef_1 = require("../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../mobile/navigation/routes");
const actionTypes_1 = require("./actionTypes");
const actions_2 = require("./actions");
const WhiteboardLimitDialog_1 = __importDefault(require("./components/native/WhiteboardLimitDialog"));
const functions_3 = require("./functions");
require("./middleware.any");
/**
 * Middleware which intercepts whiteboard actions to handle changes to the related state.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register((store) => (next) => async (action) => {
    const { dispatch, getState } = store;
    const state = getState();
    switch (action.type) {
        case actionTypes_1.SET_WHITEBOARD_OPEN: {
            const { isOpen } = action;
            const enforceUserLimit = (0, functions_3.shouldEnforceUserLimit)(state);
            const notifyUserLimit = (0, functions_3.shouldNotifyUserLimit)(state);
            if (enforceUserLimit) {
                dispatch((0, actions_2.restrictWhiteboard)(false));
                dispatch((0, actions_1.openDialog)(WhiteboardLimitDialog_1.default));
                return next(action);
            }
            if (isOpen) {
                if (enforceUserLimit) {
                    dispatch((0, actions_2.restrictWhiteboard)());
                    return next(action);
                }
                if (notifyUserLimit) {
                    dispatch((0, actions_2.notifyWhiteboardLimit)());
                }
                if ((0, functions_1.isDialogOpen)(state, WhiteboardLimitDialog_1.default)) {
                    dispatch((0, actions_1.hideDialog)(WhiteboardLimitDialog_1.default));
                }
                const collabDetails = (0, functions_3.getCollabDetails)(state);
                const collabServerUrl = (0, functions_3.generateCollabServerUrl)(state);
                const localParticipantName = (0, functions_2.getLocalParticipant)(state)?.name;
                (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.whiteboard, {
                    collabDetails,
                    collabServerUrl,
                    localParticipantName
                });
                return next(action);
            }
            break;
        }
    }
    return next(action);
});
