"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/participants/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_2 = require("../base/responsive-ui/actionTypes");
const actions_native_1 = require("./actions.native");
const functions_native_1 = require("./functions.native");
require("./subscriber.native");
/**
 * The middleware of the feature Filmstrip.
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    if (action.type === actionTypes_1.PARTICIPANT_LEFT) {
        // This have to be executed before we remove the participant from features/base/participants state in order to
        // remove the related thumbnail component before we need to re-render it. If we do this after next()
        // we will be in situation where the participant exists in the remoteParticipants array in features/filmstrip
        // but doesn't exist in features/base/participants state which will lead to rendering a thumbnail for
        // non-existing participant.
        (0, functions_native_1.updateRemoteParticipantsOnLeave)(store, action.participant?.id);
    }
    const result = next(action);
    switch (action.type) {
        case actionTypes_2.CLIENT_RESIZED:
        case actionTypes_2.SAFE_AREA_INSETS_CHANGED:
        case actionTypes_2.SET_ASPECT_RATIO:
            store.dispatch((0, actions_native_1.setTileViewDimensions)());
            break;
        case actionTypes_1.PARTICIPANT_JOINED: {
            (0, functions_native_1.updateRemoteParticipants)(store, false, action.participant?.id);
            break;
        }
    }
    return result;
});
