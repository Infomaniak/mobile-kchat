"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../base/media/actions");
const constants_1 = require("../base/media/constants");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_1 = require("../base/responsive-ui/actionTypes");
const actions_any_1 = require("../large-video/actions.any");
const actionTypes_2 = require("./actionTypes");
require("./middleware.any");
/**
 * Middleware which intercepts actions and updates the legacy component.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    const { dispatch } = store;
    switch (action.type) {
        case actionTypes_2.SET_CAR_MODE:
            dispatch((0, actions_1.setVideoMuted)(action.enabled, constants_1.VIDEO_MUTISM_AUTHORITY.CAR_MODE));
            break;
        case actionTypes_1.CLIENT_RESIZED: {
            const { clientHeight, clientWidth } = store.getState()['features/base/responsive-ui'];
            // On mobile the large video should always fill the screen.
            dispatch((0, actions_any_1.setLargeVideoDimensions)(clientHeight, clientWidth));
            break;
        }
    }
    return result;
});
