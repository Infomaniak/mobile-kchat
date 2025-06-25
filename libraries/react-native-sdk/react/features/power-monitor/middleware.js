"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error
const transport_1 = require("../../../modules/transport");
const actionTypes_1 = require("../base/conference/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_1 = require("../base/tracks/actions");
const actionTypes_2 = require("./actionTypes");
const actions_2 = require("./actions");
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    const { dispatch, getState } = store;
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOINED: {
            // listens for messages about suspend from power-monitor
            const transport = new transport_1.Transport({
                backend: new transport_1.PostMessageTransportBackend({
                    postisOptions: { scope: 'jitsi-power-monitor' }
                })
            });
            transport.on('event', (event) => {
                if (event && event.name === 'power-monitor' && event.event === 'suspend') {
                    dispatch((0, actions_2.suspendDetected)());
                    return true;
                }
                return false;
            });
            dispatch((0, actions_2.setTransport)(transport));
            break;
        }
        case actionTypes_1.CONFERENCE_LEFT: {
            const { transport } = getState()['features/power-monitor'];
            if (transport) {
                transport.dispose();
            }
            dispatch((0, actions_2.setTransport)());
            break;
        }
        case actionTypes_2.SUSPEND_DETECTED: {
            dispatch((0, actions_1.destroyLocalTracks)());
            // FIXME: when refactoring conference.js
            APP.conference.onSuspendDetected();
            APP.API.notifySuspendDetected();
            break;
        }
    }
    return result;
});
