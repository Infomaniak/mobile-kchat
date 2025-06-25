"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../app/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actions_1 = require("./actions");
/**
 * Dimensions change handler.
 */
let handler;
/**
 * Middleware that handles window dimension changes.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.APP_WILL_UNMOUNT: {
            _appWillUnmount();
            break;
        }
        case actionTypes_1.APP_WILL_MOUNT:
            _appWillMount(store);
            break;
    }
    return result;
});
/**
 * Notifies this feature that the action {@link APP_WILL_MOUNT} is being
 * dispatched within a specific redux {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @private
 * @returns {void}
 */
function _appWillMount(store) {
    handler = () => {
        const { innerHeight, innerWidth } = window;
        store.dispatch((0, actions_1.clientResized)(innerWidth, innerHeight));
    };
    window.addEventListener('resize', handler);
}
/**
 * Notifies this feature that the action {@link APP_WILL_UNMOUNT} is being
 * dispatched within a specific redux {@code store}.
 *
 * @private
 * @returns {void}
 */
function _appWillUnmount() {
    handler && window.removeEventListener('resize', handler);
    handler = undefined;
}
