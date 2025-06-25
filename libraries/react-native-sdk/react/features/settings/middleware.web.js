"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_1 = require("../base/settings/actionTypes");
const functions_web_1 = require("../base/settings/functions.web");
const actions_1 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const actions_2 = require("./actions");
const constants_2 = require("./constants");
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => next => action => {
    const oldValue = (0, functions_web_1.getHideSelfView)(getState());
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.SETTINGS_UPDATED: {
            const newValue = action.settings.disableSelfView;
            if (newValue !== oldValue && newValue) {
                dispatch((0, actions_1.showNotification)({
                    uid: constants_1.DISABLE_SELF_VIEW_NOTIFICATION_ID,
                    titleKey: 'notify.selfViewTitle',
                    customActionNameKey: ['settings.title'],
                    customActionHandler: [() => dispatch((0, actions_2.openSettingsDialog)(constants_2.SETTINGS_TABS.MORE))
                    ]
                }, constants_1.NOTIFICATION_TIMEOUT_TYPE.STICKY));
            }
        }
    }
    return result;
});
