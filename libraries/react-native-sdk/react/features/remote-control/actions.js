"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pause = exports.resume = exports.keyPressed = exports.mouseScrolled = exports.mouseMoved = exports.mouseClicked = exports.grant = exports.sendStartRequest = exports.deny = exports.endpointMessageReceived = exports.stopReceiver = exports.disableReceiver = exports.enableReceiver = exports.setReceiverTransport = exports.clearRequest = exports.stopController = exports.handleRemoteControlStoppedEvent = exports.processPermissionRequestReply = exports.requestRemoteControl = exports.setRemoteControlActive = exports.openRemoteControlAuthorizationDialog = void 0;
// @ts-expect-error
const jquery_1 = __importDefault(require("jquery"));
const actions_1 = require("../base/dialog/actions");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const actions_2 = require("../base/participants/actions");
const functions_1 = require("../base/participants/functions");
const actions_3 = require("../base/tracks/actions");
const functions_2 = require("../base/tracks/functions");
const actions_4 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const functions_3 = require("../screen-share/functions");
const actionTypes_1 = require("./actionTypes");
const RemoteControlAuthorizationDialog_1 = __importDefault(require("./components/RemoteControlAuthorizationDialog"));
const constants_2 = require("./constants");
const functions_4 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Listeners.
 */
let permissionsReplyListener, receiverEndpointMessageListener, stopListener;
/**
 * Signals that the remote control authorization dialog should be displayed.
 *
 * @param {string} participantId - The id of the participant who is requesting
 * the authorization.
 * @returns {{
 *     type: OPEN_DIALOG,
 *     component: {RemoteControlAuthorizationDialog},
 *     componentProps: {
 *         participantId: {string}
 *      }
 * }}
 * @public
 */
function openRemoteControlAuthorizationDialog(participantId) {
    return (0, actions_1.openDialog)(RemoteControlAuthorizationDialog_1.default, { participantId });
}
exports.openRemoteControlAuthorizationDialog = openRemoteControlAuthorizationDialog;
/**
 * Sets the remote control active property.
 *
 * @param {boolean} active - The new value for the active property.
 * @returns {Function}
 */
function setRemoteControlActive(active) {
    return (dispatch, getState) => {
        const state = getState();
        const { active: oldActive } = state['features/remote-control'];
        const { conference } = state['features/base/conference'];
        if (active !== oldActive) {
            dispatch({
                type: actionTypes_1.REMOTE_CONTROL_ACTIVE,
                active
            });
            conference?.setLocalParticipantProperty('remoteControlSessionStatus', active);
        }
    };
}
exports.setRemoteControlActive = setRemoteControlActive;
/**
 * Requests permissions from the remote control receiver side.
 *
 * @param {string} userId - The user id of the participant that will be
 * requested.
 * @returns {Function}
 */
function requestRemoteControl(userId) {
    return (dispatch, getState) => {
        const state = getState();
        const enabled = (0, functions_4.isRemoteControlEnabled)(state);
        if (!enabled) {
            return Promise.reject(new Error('Remote control is disabled!'));
        }
        dispatch(setRemoteControlActive(true));
        logger_1.default.log(`Requsting remote control permissions from: ${userId}`);
        const { conference } = state['features/base/conference'];
        permissionsReplyListener = (participant, event) => {
            dispatch(processPermissionRequestReply(participant.getId(), event));
        };
        conference?.on(lib_jitsi_meet_1.JitsiConferenceEvents.ENDPOINT_MESSAGE_RECEIVED, permissionsReplyListener);
        dispatch({
            type: actionTypes_1.SET_REQUESTED_PARTICIPANT,
            requestedParticipant: userId
        });
        if (!(0, functions_4.sendRemoteControlEndpointMessage)(conference, userId, {
            type: constants_2.EVENTS.permissions,
            action: constants_2.PERMISSIONS_ACTIONS.request
        })) {
            dispatch(clearRequest());
        }
    };
}
exports.requestRemoteControl = requestRemoteControl;
/**
 * Handles permission request replies on the controller side.
 *
 * @param {string} participantId - The participant that sent the request.
 * @param {EndpointMessage} event - The permission request event.
 * @returns {Function}
 */
function processPermissionRequestReply(participantId, event) {
    return (dispatch, getState) => {
        const state = getState();
        const { action, name, type } = event;
        const { requestedParticipant } = state['features/remote-control'].controller;
        if ((0, functions_4.isRemoteControlEnabled)(state) && name === constants_2.REMOTE_CONTROL_MESSAGE_NAME && type === constants_2.EVENTS.permissions
            && participantId === requestedParticipant) {
            let descriptionKey, permissionGranted = false;
            switch (action) {
                case constants_2.PERMISSIONS_ACTIONS.grant: {
                    dispatch({
                        type: actionTypes_1.SET_CONTROLLED_PARTICIPANT,
                        controlled: participantId
                    });
                    logger_1.default.log('Remote control permissions granted!', participantId);
                    logger_1.default.log('Starting remote control controller.');
                    const { conference } = state['features/base/conference'];
                    stopListener = (participant, stopEvent) => {
                        dispatch(handleRemoteControlStoppedEvent(participant.getId(), stopEvent));
                    };
                    conference?.on(lib_jitsi_meet_1.JitsiConferenceEvents.ENDPOINT_MESSAGE_RECEIVED, stopListener);
                    dispatch(resume());
                    permissionGranted = true;
                    descriptionKey = 'dialog.remoteControlAllowedMessage';
                    break;
                }
                case constants_2.PERMISSIONS_ACTIONS.deny:
                    logger_1.default.log('Remote control permissions denied!', participantId);
                    descriptionKey = 'dialog.remoteControlDeniedMessage';
                    break;
                case constants_2.PERMISSIONS_ACTIONS.error:
                    logger_1.default.error('Error occurred on receiver side');
                    descriptionKey = 'dialog.remoteControlErrorMessage';
                    break;
                default:
                    logger_1.default.error('Unknown reply received!');
                    descriptionKey = 'dialog.remoteControlErrorMessage';
            }
            dispatch(clearRequest());
            if (!permissionGranted) {
                dispatch(setRemoteControlActive(false));
            }
            dispatch((0, actions_4.showNotification)({
                descriptionArguments: { user: (0, functions_1.getParticipantDisplayName)(state, participantId) },
                descriptionKey,
                titleKey: 'dialog.remoteControlTitle'
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
            if (permissionGranted) {
                // the remote control permissions has been granted
                // pin the controlled participant
                const pinnedParticipant = (0, functions_1.getPinnedParticipant)(state);
                const virtualScreenshareParticipant = (0, functions_1.getVirtualScreenshareParticipantByOwnerId)(state, participantId);
                const pinnedId = pinnedParticipant?.id;
                if (virtualScreenshareParticipant?.id && pinnedId !== virtualScreenshareParticipant?.id) {
                    dispatch((0, actions_2.pinParticipant)(virtualScreenshareParticipant?.id));
                }
                else if (!virtualScreenshareParticipant?.id && pinnedId !== participantId) {
                    dispatch((0, actions_2.pinParticipant)(participantId));
                }
            }
        }
        else {
            // different message type or another user -> ignoring the message
        }
    };
}
exports.processPermissionRequestReply = processPermissionRequestReply;
/**
 * Handles remote control stopped.
 *
 * @param {string} participantId - The ID of the participant that has sent the event.
 * @param {EndpointMessage} event - EndpointMessage event from the data channels.
 * @property {string} type - The function process only events with name REMOTE_CONTROL_MESSAGE_NAME.
 * @returns {void}
 */
function handleRemoteControlStoppedEvent(participantId, event) {
    return (dispatch, getState) => {
        const state = getState();
        const { name, type } = event;
        const { controlled } = state['features/remote-control'].controller;
        if ((0, functions_4.isRemoteControlEnabled)(state) && name === constants_2.REMOTE_CONTROL_MESSAGE_NAME && type === constants_2.EVENTS.stop
            && participantId === controlled) {
            dispatch(stopController());
        }
    };
}
exports.handleRemoteControlStoppedEvent = handleRemoteControlStoppedEvent;
/**
 * Stops processing the mouse and keyboard events. Removes added listeners.
 * Enables the keyboard shortcuts. Displays dialog to notify the user that remote control session has ended.
 *
 * @param {boolean} notifyRemoteParty - If true a endpoint message to the controlled participant will be sent.
 * @returns {void}
 */
function stopController(notifyRemoteParty = false) {
    return (dispatch, getState) => {
        const state = getState();
        const { controlled } = state['features/remote-control'].controller;
        if (!controlled) {
            return;
        }
        const { conference } = state['features/base/conference'];
        if (notifyRemoteParty) {
            (0, functions_4.sendRemoteControlEndpointMessage)(conference, controlled, {
                type: constants_2.EVENTS.stop
            });
        }
        logger_1.default.log('Stopping remote control controller.');
        conference?.off(lib_jitsi_meet_1.JitsiConferenceEvents.ENDPOINT_MESSAGE_RECEIVED, stopListener);
        stopListener = undefined;
        dispatch(pause());
        dispatch({
            type: actionTypes_1.SET_CONTROLLED_PARTICIPANT,
            controlled: undefined
        });
        dispatch(setRemoteControlActive(false));
        dispatch((0, actions_4.showNotification)({
            descriptionKey: 'dialog.remoteControlStopMessage',
            titleKey: 'dialog.remoteControlTitle'
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
    };
}
exports.stopController = stopController;
/**
 * Clears a pending permission request.
 *
 * @returns {Function}
 */
function clearRequest() {
    return (dispatch, getState) => {
        const { conference } = getState()['features/base/conference'];
        dispatch({
            type: actionTypes_1.SET_REQUESTED_PARTICIPANT,
            requestedParticipant: undefined
        });
        conference?.off(lib_jitsi_meet_1.JitsiConferenceEvents.ENDPOINT_MESSAGE_RECEIVED, permissionsReplyListener);
        permissionsReplyListener = undefined;
    };
}
exports.clearRequest = clearRequest;
/**
 * Sets that transport object that is used by the receiver to communicate with the native part of the remote control
 * implementation.
 *
 * @param {Transport} transport - The transport to be set.
 * @returns {{
 *      type: SET_RECEIVER_TRANSPORT,
 *      transport: Transport
 * }}
 */
function setReceiverTransport(transport) {
    return {
        type: actionTypes_1.SET_RECEIVER_TRANSPORT,
        transport
    };
}
exports.setReceiverTransport = setReceiverTransport;
/**
 * Enables the receiver functionality.
 *
 * @returns {Function}
 */
function enableReceiver() {
    return (dispatch, getState) => {
        const state = getState();
        const { enabled } = state['features/remote-control'].receiver;
        if (enabled) {
            return;
        }
        const { connection } = state['features/base/connection'];
        const { conference } = state['features/base/conference'];
        if (!connection || !conference) {
            logger_1.default.error('Couldn\'t enable the remote receiver! The connection or conference instance is undefined!');
            return;
        }
        dispatch({
            type: actionTypes_1.SET_RECEIVER_ENABLED,
            enabled: true
        });
        connection.addFeature(constants_2.DISCO_REMOTE_CONTROL_FEATURE, true);
        receiverEndpointMessageListener = (participant, message) => {
            dispatch(endpointMessageReceived(participant.getId(), message));
        };
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.ENDPOINT_MESSAGE_RECEIVED, receiverEndpointMessageListener);
    };
}
exports.enableReceiver = enableReceiver;
/**
 * Disables the receiver functionality.
 *
 * @returns {Function}
 */
function disableReceiver() {
    return (dispatch, getState) => {
        const state = getState();
        const { enabled } = state['features/remote-control'].receiver;
        if (!enabled) {
            return;
        }
        const { connection } = state['features/base/connection'];
        const { conference } = state['features/base/conference'];
        if (!connection || !conference) {
            logger_1.default.error('Couldn\'t enable the remote receiver! The connection or conference instance is undefined!');
            return;
        }
        logger_1.default.log('Remote control receiver disabled.');
        dispatch({
            type: actionTypes_1.SET_RECEIVER_ENABLED,
            enabled: false
        });
        dispatch(stopReceiver(true));
        connection.removeFeature(constants_2.DISCO_REMOTE_CONTROL_FEATURE);
        conference.off(lib_jitsi_meet_1.JitsiConferenceEvents.ENDPOINT_MESSAGE_RECEIVED, receiverEndpointMessageListener);
    };
}
exports.disableReceiver = disableReceiver;
/**
 * Stops a remote control session on the receiver side.
 *
 * @param {boolean} [dontNotifyLocalParty] - If true - a notification about stopping
 * the remote control won't be displayed.
 * @param {boolean} [dontNotifyRemoteParty] - If true a endpoint message to the controller participant will be sent.
 * @returns {Function}
 */
function stopReceiver(dontNotifyLocalParty = false, dontNotifyRemoteParty = false) {
    return (dispatch, getState) => {
        const state = getState();
        const { receiver } = state['features/remote-control'];
        const { controller, transport } = receiver;
        if (!controller) {
            return;
        }
        const { conference } = state['features/base/conference'];
        if (!dontNotifyRemoteParty) {
            (0, functions_4.sendRemoteControlEndpointMessage)(conference, controller, {
                type: constants_2.EVENTS.stop
            });
        }
        dispatch({
            type: actionTypes_1.SET_CONTROLLER,
            controller: undefined
        });
        transport?.sendEvent({
            name: constants_2.REMOTE_CONTROL_MESSAGE_NAME,
            type: constants_2.EVENTS.stop
        });
        dispatch(setRemoteControlActive(false));
        if (!dontNotifyLocalParty) {
            dispatch((0, actions_4.showNotification)({
                descriptionKey: 'dialog.remoteControlStopMessage',
                titleKey: 'dialog.remoteControlTitle'
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
        }
    };
}
exports.stopReceiver = stopReceiver;
/**
 * Handles only remote control endpoint messages.
 *
 * @param {string} participantId - The controller participant ID.
 * @param {Object} message - EndpointMessage from the data channels.
 * @param {string} message.name - The function processes only messages with
 * name REMOTE_CONTROL_MESSAGE_NAME.
 * @returns {Function}
 */
function endpointMessageReceived(participantId, message) {
    return (dispatch, getState) => {
        const { action, name, type } = message;
        if (name !== constants_2.REMOTE_CONTROL_MESSAGE_NAME) {
            return;
        }
        const state = getState();
        const { receiver } = state['features/remote-control'];
        const { enabled, transport } = receiver;
        if (enabled) {
            const { controller } = receiver;
            if (!controller && type === constants_2.EVENTS.permissions && action === constants_2.PERMISSIONS_ACTIONS.request) {
                dispatch(setRemoteControlActive(true));
                dispatch(openRemoteControlAuthorizationDialog(participantId));
            }
            else if (controller === participantId) {
                if (type === constants_2.EVENTS.stop) {
                    dispatch(stopReceiver(false, true));
                }
                else { // forward the message
                    try {
                        transport?.sendEvent(message);
                    }
                    catch (error) {
                        logger_1.default.error('Error while trying to execute remote control message', error);
                    }
                }
            } // else ignore
        }
        else {
            logger_1.default.log('Remote control message is ignored because remote control is disabled', message);
        }
    };
}
exports.endpointMessageReceived = endpointMessageReceived;
/**
 * Denies remote control access for user associated with the passed user id.
 *
 * @param {string} participantId - The id associated with the user who sent the
 * request for remote control authorization.
 * @returns {Function}
 */
function deny(participantId) {
    return (dispatch, getState) => {
        const state = getState();
        const { conference } = state['features/base/conference'];
        dispatch(setRemoteControlActive(false));
        (0, functions_4.sendRemoteControlEndpointMessage)(conference, participantId, {
            type: constants_2.EVENTS.permissions,
            action: constants_2.PERMISSIONS_ACTIONS.deny
        });
    };
}
exports.deny = deny;
/**
 * Sends start remote control request to the native implementation.
 *
 * @returns {Function}
 */
function sendStartRequest() {
    return (dispatch, getState) => {
        const state = getState();
        const tracks = state['features/base/tracks'];
        const track = (0, functions_2.getLocalDesktopTrack)(tracks);
        const { sourceId } = track?.jitsiTrack || {};
        const { transport } = state['features/remote-control'].receiver;
        if (typeof sourceId === 'undefined') {
            return Promise.reject(new Error('Cannot identify screen for the remote control session'));
        }
        return transport?.sendRequest({
            name: constants_2.REMOTE_CONTROL_MESSAGE_NAME,
            type: constants_2.REQUESTS.start,
            sourceId
        });
    };
}
exports.sendStartRequest = sendStartRequest;
/**
 * Grants remote control access to user associated with the passed user id.
 *
 * @param {string} participantId - The id associated with the user who sent the
 * request for remote control authorization.
 * @returns {Function}
 */
function grant(participantId) {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes_1.SET_CONTROLLER,
            controller: participantId
        });
        logger_1.default.log(`Remote control permissions granted to: ${participantId}`);
        let promise;
        const state = getState();
        const tracks = state['features/base/tracks'];
        const track = (0, functions_2.getLocalDesktopTrack)(tracks);
        const isScreenSharing = (0, functions_3.isScreenVideoShared)(state);
        const { sourceType } = track?.jitsiTrack || {};
        if (isScreenSharing && sourceType === 'screen') {
            promise = dispatch(sendStartRequest());
        }
        else {
            promise = dispatch((0, actions_3.toggleScreensharing)(true, false, { desktopSharingSources: ['screen'] }))
                .then(() => dispatch(sendStartRequest()));
        }
        const { conference } = state['features/base/conference'];
        promise
            .then(() => (0, functions_4.sendRemoteControlEndpointMessage)(conference, participantId, {
            type: constants_2.EVENTS.permissions,
            action: constants_2.PERMISSIONS_ACTIONS.grant
        }))
            .catch((error) => {
            logger_1.default.error(error);
            (0, functions_4.sendRemoteControlEndpointMessage)(conference, participantId, {
                type: constants_2.EVENTS.permissions,
                action: constants_2.PERMISSIONS_ACTIONS.error
            });
            dispatch((0, actions_4.showNotification)({
                descriptionKey: 'dialog.startRemoteControlErrorMessage',
                titleKey: 'dialog.remoteControlTitle'
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
            dispatch(stopReceiver(true));
        });
    };
}
exports.grant = grant;
/**
 * Handler for mouse click events on the controller side.
 *
 * @param {string} type - The type of event ("mousedown"/"mouseup").
 * @param {Event} event - The mouse event.
 * @returns {Function}
 */
function mouseClicked(type, event) {
    return (dispatch, getState) => {
        const state = getState();
        const { conference } = state['features/base/conference'];
        const { controller } = state['features/remote-control'];
        (0, functions_4.sendRemoteControlEndpointMessage)(conference, controller.controlled, {
            type,
            // @ts-ignore
            button: event.which
        });
    };
}
exports.mouseClicked = mouseClicked;
/**
 * Handles mouse moved events on the controller side.
 *
 * @param {Event} event - The mouse event.
 * @returns {Function}
 */
function mouseMoved(event) {
    return (dispatch, getState) => {
        const area = (0, functions_4.getRemoteConrolEventCaptureArea)();
        if (!area) {
            return;
        }
        const position = area.position();
        const state = getState();
        const { conference } = state['features/base/conference'];
        const { controller } = state['features/remote-control'];
        (0, functions_4.sendRemoteControlEndpointMessage)(conference, controller.controlled, {
            type: constants_2.EVENTS.mousemove,
            x: (event.pageX - position.left) / area.width(),
            y: (event.pageY - position.top) / area.height()
        });
    };
}
exports.mouseMoved = mouseMoved;
/**
 * Handles mouse scroll events on the controller side.
 *
 * @param {Event} event - The mouse event.
 * @returns {Function}
 */
function mouseScrolled(event) {
    return (dispatch, getState) => {
        const state = getState();
        const { conference } = state['features/base/conference'];
        const { controller } = state['features/remote-control'];
        (0, functions_4.sendRemoteControlEndpointMessage)(conference, controller.controlled, {
            type: constants_2.EVENTS.mousescroll,
            x: event.deltaX,
            y: event.deltaY
        });
    };
}
exports.mouseScrolled = mouseScrolled;
/**
 * Handles key press events on the controller side..
 *
 * @param {string} type - The type of event ("keydown"/"keyup").
 * @param {Event} event - The key event.
 * @returns {Function}
 */
function keyPressed(type, event) {
    return (dispatch, getState) => {
        const state = getState();
        const { conference } = state['features/base/conference'];
        const { controller } = state['features/remote-control'];
        (0, functions_4.sendRemoteControlEndpointMessage)(conference, controller.controlled, {
            type,
            key: (0, functions_4.getKey)(event),
            modifiers: (0, functions_4.getModifiers)(event)
        });
    };
}
exports.keyPressed = keyPressed;
/**
* Disables the keyboatd shortcuts. Starts collecting remote control
* events. It can be used to resume an active remote control session which
* was paused with the pause action.
*
* @returns {Function}
*/
function resume() {
    return (dispatch, getState) => {
        const area = (0, functions_4.getRemoteConrolEventCaptureArea)();
        const state = getState();
        const { controller } = state['features/remote-control'];
        const { controlled, isCapturingEvents } = controller;
        if (!(0, functions_4.isRemoteControlEnabled)(state) || !area || !controlled || isCapturingEvents) {
            return;
        }
        logger_1.default.log('Resuming remote control controller.');
        area.mousemove((event) => {
            dispatch(mouseMoved(event));
        });
        area.mousedown((event) => dispatch(mouseClicked(constants_2.EVENTS.mousedown, event)));
        area.mouseup((event) => dispatch(mouseClicked(constants_2.EVENTS.mouseup, event)));
        area.dblclick((event) => dispatch(mouseClicked(constants_2.EVENTS.mousedblclick, event)));
        area.contextmenu(() => false);
        area[0].onwheel = (event) => {
            event.preventDefault();
            event.stopPropagation();
            dispatch(mouseScrolled(event));
            return false;
        };
        (0, jquery_1.default)(window).keydown((event) => dispatch(keyPressed(constants_2.EVENTS.keydown, event)));
        (0, jquery_1.default)(window).keyup((event) => dispatch(keyPressed(constants_2.EVENTS.keyup, event)));
        dispatch({
            type: actionTypes_1.CAPTURE_EVENTS,
            isCapturingEvents: true
        });
    };
}
exports.resume = resume;
/**
 * Pauses the collecting of events and enables the keyboard shortcus. But
 * it doesn't removes any other listeners. Basically the remote control
 * session will be still active after the pause action, but no events from the
 * controller side will be captured and sent. You can resume the collecting
 * of the events with the resume action.
 *
 * @returns {Function}
 */
function pause() {
    return (dispatch, getState) => {
        const state = getState();
        const { controller } = state['features/remote-control'];
        const { controlled, isCapturingEvents } = controller;
        if (!(0, functions_4.isRemoteControlEnabled)(state) || !controlled || !isCapturingEvents) {
            return;
        }
        logger_1.default.log('Pausing remote control controller.');
        const area = (0, functions_4.getRemoteConrolEventCaptureArea)();
        if (area) {
            area.off('contextmenu');
            area.off('dblclick');
            area.off('mousedown');
            area.off('mousemove');
            area.off('mouseup');
            area[0].onwheel = undefined;
        }
        (0, jquery_1.default)(window).off('keydown');
        (0, jquery_1.default)(window).off('keyup');
        dispatch({
            type: actionTypes_1.CAPTURE_EVENTS,
            isCapturingEvents: false
        });
    };
}
exports.pause = pause;
