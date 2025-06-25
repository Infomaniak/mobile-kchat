"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const functions_1 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_web_1 = require("./actions.web");
const constants_1 = require("./constants");
require("./middleware.any");
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => next => action => {
    const state = getState();
    const localParticipantId = (0, functions_1.getLocalParticipant)(state)?.id;
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOIN_IN_PROGRESS: {
            const { conference } = action;
            conference.addCommandListener(constants_1.SHARED_VIDEO, ({ attributes }) => {
                const { from } = attributes;
                const status = attributes.state;
                if (status === 'playing') {
                    if (localParticipantId !== from) {
                        dispatch((0, actions_web_1.setDisableButton)(true));
                    }
                }
                else if (status === 'stop') {
                    dispatch((0, actions_web_1.setDisableButton)(false));
                }
            });
            break;
        }
    }
    return next(action);
});
