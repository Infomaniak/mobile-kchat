"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../app/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const NetworkInfoService_1 = __importDefault(require("./NetworkInfoService"));
const actions_1 = require("./actions");
const constants_1 = require("./constants");
const events_1 = require("./events");
const logger_1 = __importDefault(require("./logger"));
/**
 * Middleware for 'base/net-info' feature.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            if (NetworkInfoService_1.default.isSupported()) {
                const networkInfoService = new NetworkInfoService_1.default();
                const stop = () => {
                    networkInfoService.stop();
                    // @ts-ignore
                    networkInfoService.removeAllListeners();
                };
                // @ts-ignore
                networkInfoService.addListener(events_1.ONLINE_STATE_CHANGED_EVENT, ({ isOnline, networkType, details }) => {
                    logger_1.default.info('Network changed', JSON.stringify({
                        isOnline,
                        details,
                        networkType
                    }));
                    dispatch((0, actions_1.setNetworkInfo)({
                        isOnline,
                        networkType,
                        details
                    }));
                });
                dispatch((0, actions_1._storeNetworkInfoCleanup)(stop));
                networkInfoService.start();
            }
            break;
        case actionTypes_1.APP_WILL_UNMOUNT:
            {
                const { _cleanup } = getState()[constants_1.STORE_NAME];
                if (_cleanup) {
                    _cleanup();
                    dispatch((0, actions_1._storeNetworkInfoCleanup)(undefined));
                }
            }
            break;
    }
    return result;
});
