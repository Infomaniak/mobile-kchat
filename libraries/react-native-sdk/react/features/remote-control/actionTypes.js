"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_REQUESTED_PARTICIPANT = exports.SET_CONTROLLED_PARTICIPANT = exports.SET_CONTROLLER = exports.SET_RECEIVER_ENABLED = exports.SET_RECEIVER_TRANSPORT = exports.REMOTE_CONTROL_ACTIVE = exports.CAPTURE_EVENTS = void 0;
/**
 * The type of (redux) action which signals that the controller is capturing mouse and keyboard events.
 *
 * {
 *     type: CAPTURE_EVENTS,
 *     isCapturingEvents: boolean
 * }
 */
exports.CAPTURE_EVENTS = 'CAPTURE_EVENTS';
/**
 * The type of (redux) action which signals that a remote control active state has changed.
 *
 * {
 *     type: REMOTE_CONTROL_ACTIVE,
 *     active: boolean
 * }
 */
exports.REMOTE_CONTROL_ACTIVE = 'REMOTE_CONTROL_ACTIVE';
/**
 * The type of (redux) action which sets the receiver transport object.
 *
 * {
 *     type: SET_RECEIVER_TRANSPORT,
 *     transport: Transport
 * }
 */
exports.SET_RECEIVER_TRANSPORT = 'SET_RECEIVER_TRANSPORT';
/**
 * The type of (redux) action which enables the receiver.
 *
 * {
 *     type: SET_RECEIVER_ENABLED,
 *     enabled: boolean
 * }
 */
exports.SET_RECEIVER_ENABLED = 'SET_RECEIVER_ENABLED';
/**
 * The type of (redux) action which sets the controller participant on the receiver side.
 * {
 *     type: SET_CONTROLLER,
 *     controller: string
 * }
 */
exports.SET_CONTROLLER = 'SET_CONTROLLER';
/**
 * The type of (redux) action which sets the controlled participant on the controller side.
 * {
 *     type: SET_CONTROLLED_PARTICIPANT,
 *     controlled: string
 * }
 */
exports.SET_CONTROLLED_PARTICIPANT = 'SET_CONTROLLED_PARTICIPANT';
/**
 * The type of (redux) action which sets the requested participant on the controller side.
 * {
 *     type: SET_REQUESTED_PARTICIPANT,
 *     requestedParticipant: string
 * }
 */
exports.SET_REQUESTED_PARTICIPANT = 'SET_REQUESTED_PARTICIPANT';
