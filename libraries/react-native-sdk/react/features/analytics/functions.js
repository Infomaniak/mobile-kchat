"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAnalytics = exports.createHandlers = exports.resetAnalytics = exports.getAmplitudeIdentity = exports.sendAnalytics = void 0;
// @ts-expect-error
const constants_1 = require("../../../modules/API/constants");
const functions_1 = require("../app/functions");
const functions_2 = require("../base/conference/functions");
const checkChromeExtensionsInstalled_1 = __importDefault(require("../base/environment/checkChromeExtensionsInstalled"));
const utils_1 = require("../base/environment/utils");
const lib_jitsi_meet_1 = __importStar(require("../base/lib-jitsi-meet"));
const functions_any_1 = require("../base/lib-jitsi-meet/functions.any");
const helpers_1 = require("../base/util/helpers");
const iframeUtils_1 = require("../base/util/iframeUtils");
const loadScript_1 = require("../base/util/loadScript");
const uri_1 = require("../base/util/uri");
const functions_3 = require("../prejoin/functions");
const AmplitudeHandler_1 = __importDefault(require("./handlers/AmplitudeHandler"));
const MatomoHandler_1 = __importDefault(require("./handlers/MatomoHandler"));
const logger_1 = __importDefault(require("./logger"));
/**
 * Sends an event through the lib-jitsi-meet AnalyticsAdapter interface.
 *
 * @param {Object} event - The event to send. It should be formatted as
 * described in AnalyticsAdapter.js in lib-jitsi-meet.
 * @returns {void}
 */
function sendAnalytics(event) {
    try {
        lib_jitsi_meet_1.analytics.sendEvent(event);
    }
    catch (e) {
        logger_1.default.warn(`Error sending analytics event: ${e}`);
    }
}
exports.sendAnalytics = sendAnalytics;
/**
 * Return saved amplitude identity info such as session id, device id and user id. We assume these do not change for
 * the duration of the conference.
 *
 * @returns {Object}
 */
function getAmplitudeIdentity() {
    return lib_jitsi_meet_1.analytics.amplitudeIdentityProps;
}
exports.getAmplitudeIdentity = getAmplitudeIdentity;
/**
 * Resets the analytics adapter to its initial state - removes handlers, cache,
 * disabled state, etc.
 *
 * @returns {void}
 */
function resetAnalytics() {
    lib_jitsi_meet_1.analytics.reset();
}
exports.resetAnalytics = resetAnalytics;
/**
 * Creates the analytics handlers.
 *
 * @param {Store} store - The redux store in which the specified {@code action} is being dispatched.
 * @returns {Promise} Resolves with the handlers that have been successfully loaded.
 */
async function createHandlers({ getState }) {
    (0, helpers_1.getJitsiMeetGlobalNS)().analyticsHandlers = [];
    if (!(0, functions_any_1.isAnalyticsEnabled)(getState)) {
        // Avoid all analytics processing if there are no handlers, since no event would be sent.
        lib_jitsi_meet_1.analytics.dispose();
        return [];
    }
    const state = getState();
    const config = state['features/base/config'];
    const { locationURL } = state['features/base/connection'];
    const host = locationURL ? locationURL.host : '';
    const { analytics: analyticsConfig = {}, deploymentInfo } = config;
    const { amplitudeAPPKey, amplitudeIncludeUTM, blackListedEvents, scriptURLs, googleAnalyticsTrackingId, matomoEndpoint, matomoSiteID, whiteListedEvents } = analyticsConfig;
    const { group, user } = state['features/base/jwt'];
    const handlerConstructorOptions = {
        amplitudeAPPKey,
        amplitudeIncludeUTM,
        blackListedEvents,
        envType: deploymentInfo?.envType || 'dev',
        googleAnalyticsTrackingId,
        matomoEndpoint,
        matomoSiteID,
        group,
        host,
        product: deploymentInfo?.product,
        subproduct: deploymentInfo?.environment,
        user: user?.id,
        version: lib_jitsi_meet_1.default.version,
        whiteListedEvents
    };
    const handlers = [];
    if (amplitudeAPPKey) {
        try {
            const amplitude = new AmplitudeHandler_1.default(handlerConstructorOptions);
            lib_jitsi_meet_1.analytics.amplitudeIdentityProps = amplitude.getIdentityProps();
            handlers.push(amplitude);
        }
        catch (e) {
            logger_1.default.error('Failed to initialize Amplitude handler', e);
        }
    }
    if (matomoEndpoint && matomoSiteID) {
        try {
            const matomo = new MatomoHandler_1.default(handlerConstructorOptions);
            handlers.push(matomo);
        }
        catch (e) {
            logger_1.default.error('Failed to initialize Matomo handler', e);
        }
    }
    if (Array.isArray(scriptURLs) && scriptURLs.length > 0) {
        let externalHandlers;
        try {
            externalHandlers = await _loadHandlers(scriptURLs, handlerConstructorOptions);
            handlers.push(...externalHandlers);
        }
        catch (e) {
            logger_1.default.error('Failed to initialize external analytics handlers', e);
        }
    }
    // Avoid all analytics processing if there are no handlers, since no event would be sent.
    if (handlers.length === 0) {
        lib_jitsi_meet_1.analytics.dispose();
    }
    logger_1.default.info(`Initialized ${handlers.length} analytics handlers`);
    return handlers;
}
exports.createHandlers = createHandlers;
/**
 * Inits JitsiMeetJS.analytics by setting permanent properties and setting the handlers from the loaded scripts.
 * NOTE: Has to be used after JitsiMeetJS.init. Otherwise analytics will be null.
 *
 * @param {Store} store - The redux store in which the specified {@code action} is being dispatched.
 * @param {Array<Object>} handlers - The analytics handlers.
 * @returns {boolean} - True if the analytics were successfully initialized and false otherwise.
 */
function initAnalytics(store, handlers) {
    const { getState, dispatch } = store;
    if (!(0, functions_any_1.isAnalyticsEnabled)(getState) || handlers.length === 0) {
        return false;
    }
    const state = getState();
    const config = state['features/base/config'];
    const { deploymentInfo } = config;
    const { group, server } = state['features/base/jwt'];
    const { locationURL = { href: '' } } = state['features/base/connection'];
    const { tenant } = (0, uri_1.parseURIString)(locationURL.href) || {};
    const permanentProperties = {};
    if (server) {
        permanentProperties.server = server;
    }
    if (group) {
        permanentProperties.group = group;
    }
    // Report the application name
    permanentProperties.appName = (0, functions_1.getName)();
    // Report if user is using websocket
    permanentProperties.websocket = typeof config.websocket === 'string';
    // Report if user is using the external API
    permanentProperties.externalApi = typeof constants_1.API_ID === 'number';
    // Report if we are loaded in iframe
    permanentProperties.inIframe = (0, iframeUtils_1.inIframe)();
    // Report the tenant from the URL.
    permanentProperties.tenant = tenant || '/';
    permanentProperties.wasPrejoinDisplayed = (0, functions_3.isPrejoinPageVisible)(state);
    // Currently we don't know if there will be lobby. We will update it to true if we go through lobby.
    permanentProperties.wasLobbyVisible = false;
    // Setting visitor properties to false by default. We will update them later if it turns out we are visitor.
    permanentProperties.isVisitor = false;
    permanentProperties.isPromotedFromVisitor = false;
    // Optionally, include local deployment information based on the
    // contents of window.config.deploymentInfo.
    if (deploymentInfo) {
        for (const key in deploymentInfo) {
            if (deploymentInfo.hasOwnProperty(key)) {
                permanentProperties[key] = deploymentInfo[key];
            }
        }
    }
    lib_jitsi_meet_1.analytics.addPermanentProperties({
        ...permanentProperties,
        ...getState()['features/analytics'].initialPermanentProperties
    });
    lib_jitsi_meet_1.analytics.setConferenceName((0, functions_2.getAnalyticsRoomName)(state, dispatch));
    // Set the handlers last, since this triggers emptying of the cache
    lib_jitsi_meet_1.analytics.setAnalyticsHandlers(handlers);
    if (!(0, utils_1.isMobileBrowser)() && lib_jitsi_meet_1.browser.isChromiumBased()) {
        const bannerCfg = state['features/base/config'].chromeExtensionBanner;
        (0, checkChromeExtensionsInstalled_1.default)(bannerCfg).then(extensionsInstalled => {
            if (extensionsInstalled?.length) {
                lib_jitsi_meet_1.analytics.addPermanentProperties({
                    hasChromeExtension: extensionsInstalled.some(ext => ext)
                });
            }
        });
    }
    return true;
}
exports.initAnalytics = initAnalytics;
/**
 * Tries to load the scripts for the external analytics handlers and creates them.
 *
 * @param {Array} scriptURLs - The array of script urls to load.
 * @param {Object} handlerConstructorOptions - The default options to pass when creating handlers.
 * @private
 * @returns {Promise} Resolves with the handlers that have been successfully loaded and rejects if there are no handlers
 * loaded or the analytics is disabled.
 */
function _loadHandlers(scriptURLs = [], handlerConstructorOptions) {
    const promises = [];
    for (const url of scriptURLs) {
        promises.push((0, loadScript_1.loadScript)(url).then(() => {
            return { type: 'success' };
        }, (error) => {
            return {
                type: 'error',
                error,
                url
            };
        }));
    }
    return Promise.all(promises).then(values => {
        for (const el of values) {
            if (el.type === 'error') {
                logger_1.default.warn(`Failed to load ${el.url}: ${el.error}`);
            }
        }
        const handlers = [];
        for (const Handler of (0, helpers_1.getJitsiMeetGlobalNS)().analyticsHandlers) {
            // Catch any error while loading to avoid skipping analytics in case
            // of multiple scripts.
            try {
                handlers.push(new Handler(handlerConstructorOptions));
            }
            catch (error) {
                logger_1.default.warn(`Error creating analytics handler: ${error}`);
            }
        }
        logger_1.default.debug(`Loaded ${handlers.length} external analytics handlers`);
        return handlers;
    });
}
