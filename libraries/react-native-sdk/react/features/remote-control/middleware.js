"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error
const transport_1 = require("@jitsi/js-utils/transport");
const actionTypes_1 = require("../base/app/actionTypes");
const actionTypes_2 = require("../base/conference/actionTypes");
const actionTypes_3 = require("../base/participants/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_1 = require("./actions");
const constants_1 = require("./constants");
const functions_1 = require("./functions");
require("./subscriber");
/**
 * The redux middleware for the remote control feature.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => async (action) => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT: {
            const { dispatch } = store;
            dispatch((0, actions_1.setReceiverTransport)(new transport_1.Transport({
                backend: new transport_1.PostMessageTransportBackend({
                    postisOptions: { scope: 'jitsi-remote-control' }
                })
            })));
            break;
        }
        case actionTypes_1.APP_WILL_UNMOUNT: {
            const { getState, dispatch } = store;
            const { transport } = getState()['features/remote-control'].receiver;
            if (transport) {
                transport.dispose();
                dispatch((0, actions_1.setReceiverTransport)());
            }
            break;
        }
        case actionTypes_2.CONFERENCE_JOINED: {
            const result = next(action);
            const { getState } = store;
            const { transport } = getState()['features/remote-control'].receiver;
            if (transport) {
                // We expect here that even if we receive the supported event earlier
                // it will be cached and we'll receive it.
                transport.on('event', (event) => {
                    if (event.name === constants_1.REMOTE_CONTROL_MESSAGE_NAME) {
                        (0, functions_1.onRemoteControlAPIEvent)(event, store);
                        return true;
                    }
                    return false;
                });
            }
            return result;
        }
        case actionTypes_3.PARTICIPANT_LEFT: {
            const { getState, dispatch } = store;
            const state = getState();
            const { id } = action.participant;
            const { receiver, controller } = state['features/remote-control'];
            const { requestedParticipant, controlled } = controller;
            if (id === controlled) {
                dispatch((0, actions_1.stopController)());
            }
            if (id === requestedParticipant) {
                dispatch((0, actions_1.clearRequest)());
                dispatch((0, actions_1.setRemoteControlActive)(false));
            }
            if (receiver?.controller === id) {
                dispatch((0, actions_1.stopReceiver)(false, true));
            }
            break;
        }
    }
    return next(action);
});
