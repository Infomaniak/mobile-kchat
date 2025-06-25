"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const actionTypes_1 = require("../base/conference/actionTypes");
const actions_web_1 = require("../base/connection/actions.web");
const functions_1 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_web_2 = require("../base/tracks/actions.web");
const constants_1 = require("../base/tracks/constants");
require("./middleware.any");
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.ENDPOINT_MESSAGE_RECEIVED: {
            const { participant, data } = action;
            if (data?.name === constants_1.CAMERA_FACING_MODE_MESSAGE) {
                APP.store.dispatch((0, actions_web_2.openAllowToggleCameraDialog)(
                /* onAllow */ () => APP.store.dispatch((0, actions_web_2.setCameraFacingMode)(data.facingMode)), 
                /* initiatorId */ participant.getId()));
            }
            break;
        }
        case actionTypes_1.KICKED_OUT: {
            const { dispatch } = store;
            const { participant } = action;
            const participantDisplayName = (0, functions_1.getParticipantDisplayName)(store.getState, participant.getId());
            dispatch((0, actions_web_1.hangup)(true, i18next_1.default.t('dialog.kickTitle', { participantDisplayName })));
            break;
        }
    }
    return next(action);
});
