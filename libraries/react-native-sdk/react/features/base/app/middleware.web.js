"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const iframeUtils_1 = require("../util/iframeUtils");
const actionTypes_1 = require("./actionTypes");
const logger_1 = __importDefault(require("./logger"));
/**
 * Experimental feature to monitor CPU pressure.
 */
let pressureObserver;
/**
 * Middleware which intercepts app actions to handle changes to the related state.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(() => (next) => async (action) => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT: {
            // Disable it inside an iframe until Google fixes the origin trial for 3rd party sources:
            // https://bugs.chromium.org/p/chromium/issues/detail?id=1504167
            if (!(0, iframeUtils_1.inIframe)() && 'PressureObserver' in globalThis) {
                pressureObserver = new window.PressureObserver((records) => {
                    logger_1.default.info('Compute pressure state changed:', JSON.stringify(records));
                    if (typeof APP !== 'undefined') {
                        APP.API.notifyComputePressureChanged(records);
                    }
                }, { sampleRate: 1 });
                try {
                    pressureObserver
                        .observe('cpu')
                        .catch((e) => logger_1.default.error('CPU pressure observer failed to start', e));
                }
                catch (e) {
                    logger_1.default.error('CPU pressure observer failed to start', e);
                }
            }
            break;
        }
        case actionTypes_1.APP_WILL_UNMOUNT: {
            if (pressureObserver) {
                pressureObserver.unobserve('cpu');
            }
            break;
        }
    }
    return next(action);
});
