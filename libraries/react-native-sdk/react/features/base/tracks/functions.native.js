"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocalTracksF = void 0;
const lib_jitsi_meet_1 = __importDefault(require("../lib-jitsi-meet"));
const functions_any_1 = require("./functions.any");
__exportStar(require("./functions.any"), exports);
/**
 * Create local tracks of specific types.
 *
 * @param {Object} options - The options with which the local tracks are to be
 * created.
 * @param {string|null} [options.cameraDeviceId] - Camera device id or
 * {@code undefined} to use app's settings.
 * @param {string[]} options.devices - Required track types such as 'audio'
 * and/or 'video'.
 * @param {string|null} [options.micDeviceId] - Microphone device id or
 * {@code undefined} to use app's settings.
 * @param {number|undefined} [oprions.timeout] - A timeout for JitsiMeetJS.createLocalTracks used to create the tracks.
 * @param {boolean} [options.firePermissionPromptIsShownEvent] - Whether lib-jitsi-meet
 * should check for a {@code getUserMedia} permission prompt and fire a
 * corresponding event.
 * @param {IStore} store - The redux store in the context of which the function
 * is to execute and from which state such as {@code config} is to be retrieved.
 * @returns {Promise<JitsiLocalTrack[]>}
 */
function createLocalTracksF(options = {}, store) {
    const { cameraDeviceId, micDeviceId } = options;
    const state = store.getState();
    const { resolution } = state['features/base/config'];
    const constraints = options.constraints ?? state['features/base/config'].constraints;
    return lib_jitsi_meet_1.default.createLocalTracks({
        cameraDeviceId,
        constraints,
        // Copy array to avoid mutations inside library.
        devices: options.devices?.slice(0),
        facingMode: options.facingMode || (0, functions_any_1.getCameraFacingMode)(state),
        micDeviceId,
        resolution
    });
}
exports.createLocalTracksF = createLocalTracksF;
