"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/app/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_2 = require("./actionTypes");
const actions_any_1 = require("./actions.any");
const functions_web_1 = require("./functions.web");
require("./middleware.any");
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT: {
            store.dispatch((0, actions_any_1.fetchCustomBrandingData)());
            break;
        }
        case actionTypes_2.SET_DYNAMIC_BRANDING_DATA: {
            const { customTheme } = action.value;
            if (customTheme) {
                action.value.muiBrandedTheme = (0, functions_web_1.createMuiBrandingTheme)(customTheme);
            }
        }
    }
    return next(action);
});
