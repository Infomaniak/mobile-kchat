"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/config/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_2 = require("./actionTypes");
const actions_native_1 = require("./actions.native");
require("./middleware.any");
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.SET_CONFIG: {
            const result = next(action);
            store.dispatch((0, actions_native_1.fetchCustomBrandingData)());
            return result;
        }
        case actionTypes_2.SET_DYNAMIC_BRANDING_DATA: {
            const { avatarBackgrounds = [], backgroundColor, backgroundImageUrl, brandedIcons, didPageUrl, inviteDomain, labels } = action.value;
            action.value = {
                avatarBackgrounds,
                backgroundColor,
                backgroundImageUrl,
                brandedIcons,
                didPageUrl,
                inviteDomain,
                labels
            };
            // The backend may send an empty string, make sure we skip that.
            if (Array.isArray(avatarBackgrounds)) {
                // TODO: implement support for gradients.
                action.value.avatarBackgrounds = avatarBackgrounds.filter((color) => !color.includes('linear-gradient'));
            }
            break;
        }
    }
    return next(action);
});
