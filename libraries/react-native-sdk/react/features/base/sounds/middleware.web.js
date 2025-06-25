"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_web_1 = require("../devices/functions.web");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actionTypes_1 = require("./actionTypes");
require("./middleware.any");
/**
 * Implements the entry point of the middleware of the feature base/sounds.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(_store => next => action => {
    switch (action.type) {
        case actionTypes_1._ADD_AUDIO_ELEMENT:
            action.audioElement?.setSinkId?.((0, functions_web_1.getAudioOutputDeviceId)());
            break;
    }
    return next(action);
});
