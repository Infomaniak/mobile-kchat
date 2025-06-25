"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../base/dialog/actions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_1 = require("./actionTypes");
const AddPeopleDialog_1 = __importDefault(require("./components/add-people-dialog/web/AddPeopleDialog"));
require("./middleware.any");
/**
 * The middleware of the feature invite specific to Web/React.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.BEGIN_ADD_PEOPLE:
            return _beginAddPeople(store, next, action);
        case actionTypes_1.HIDE_ADD_PEOPLE_DIALOG:
            return _hideAddPeopleDialog(store, next, action);
    }
    return next(action);
});
/**
 * Notifies the feature invite that the action {@link BEGIN_ADD_PEOPLE} is being
 * dispatched within a specific redux {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code BEGIN_ADD_PEOPLE} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {*} The value returned by {@code next(action)}.
 */
function _beginAddPeople({ dispatch }, next, action) {
    const result = next(action);
    dispatch((0, actions_1.openDialog)(AddPeopleDialog_1.default));
    return result;
}
/**
 * Notifies the feature invite that the action {@link HIDE_ADD_PEOPLE_DIALOG} is being
 * dispatched within a specific redux {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code HIDE_ADD_PEOPLE_DIALOG} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {*} The value returned by {@code next(action)}.
 */
function _hideAddPeopleDialog({ dispatch }, next, action) {
    dispatch((0, actions_1.hideDialog)(AddPeopleDialog_1.default));
    return next(action);
}
