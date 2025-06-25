"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_native_1 = require("../app/actions.native");
const actionTypes_1 = require("../base/conference/actionTypes");
const actions_1 = require("../base/conference/actions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_native_2 = require("./actions.native");
require("./middleware.any");
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.KICKED_OUT: {
            const { dispatch } = store;
            dispatch((0, actions_native_2.notifyKickedOut)(action.participant, () => {
                dispatch((0, actions_1.conferenceLeft)(action.conference));
                dispatch((0, actions_native_1.appNavigate)(undefined));
            }));
            break;
        }
    }
    return next(action);
});
