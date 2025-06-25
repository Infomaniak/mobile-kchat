"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const statsEmitter_1 = __importDefault(require("./statsEmitter"));
/**
 * Implements the middleware of the feature connection-indicator.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOINED: {
            statsEmitter_1.default.startListeningForStats(action.conference);
            break;
        }
    }
    return next(action);
});
