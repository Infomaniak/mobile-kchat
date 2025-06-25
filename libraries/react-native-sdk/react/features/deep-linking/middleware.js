"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_1 = require("./actionTypes");
const functions_1 = require("./functions");
/**
 * Implements the middleware of the deep linking feature.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.OPEN_DESKTOP_APP:
            (0, functions_1.openDesktopApp)(store.getState());
            break;
    }
    return next(action);
});
