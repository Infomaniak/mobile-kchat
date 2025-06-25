"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actionTypes_1 = require("./actionTypes");
const actions_1 = require("./actions");
/**
 * Middleware that handles widnow dimension changes and updates the aspect ratio and
 * reduced UI modes accordingly.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(({ dispatch }) => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.CLIENT_RESIZED: {
            const { clientWidth: width, clientHeight: height } = action;
            dispatch((0, actions_1.setAspectRatio)(width, height));
            dispatch((0, actions_1.setReducedUI)(width, height));
            break;
        }
    }
    return result;
});
