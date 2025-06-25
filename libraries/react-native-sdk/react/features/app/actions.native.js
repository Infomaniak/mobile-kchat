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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reloadNow = exports.maybeRedirectToWelcomePage = exports.appNavigate = void 0;
const actions_1 = require("../base/conference/actions");
const functions_1 = require("../base/conference/functions");
const actions_2 = require("../base/config/actions");
const functions_native_1 = require("../base/config/functions.native");
const actions_native_1 = require("../base/connection/actions.native");
const constants_1 = require("../base/connection/constants");
const functions_native_2 = require("../base/lib-jitsi-meet/functions.native");
const actions_native_2 = require("../base/tracks/actions.native");
const isInsecureRoomName_1 = __importDefault(require("../base/util/isInsecureRoomName"));
const parseURLParams_1 = require("../base/util/parseURLParams");
const uri_1 = require("../base/util/uri");
const functions_2 = require("../mobile/navigation/functions");
const rootNavigationContainerRef_1 = require("../mobile/navigation/rootNavigationContainerRef");
const routes_1 = require("../mobile/navigation/routes");
const actions_3 = require("../notifications/actions");
const functions_3 = require("../prejoin/functions");
const actions_any_1 = require("./actions.any");
const functions_native_3 = require("./functions.native");
const logger_1 = __importDefault(require("./logger"));
__exportStar(require("./actions.any"), exports);
/**
 * Triggers an in-app navigation to a specific route. Allows navigation to be
 * abstracted between the mobile/React Native and Web/React applications.
 *
 * @param {string|undefined} uri - The URI to which to navigate. It may be a
 * full URL with an HTTP(S) scheme, a full or partial URI with the app-specific
 * scheme, or a mere room name.
 * @param {Object} [options] - Options.
 * @returns {Function}
 */
function appNavigate(uri, options = {}) {
    logger_1.default.info(`appNavigate to ${uri}`);
    return async (dispatch, getState) => {
        let location = (0, uri_1.parseURIString)(uri);
        // If the specified location (URI) does not identify a host, use the app's
        // default.
        if (!location?.host) {
            const defaultLocation = (0, uri_1.parseURIString)((0, functions_native_3.getDefaultURL)(getState));
            if (location) {
                location.host = defaultLocation.host;
                // FIXME Turn location's host, hostname, and port properties into
                // setters in order to reduce the risks of inconsistent state.
                location.hostname = defaultLocation.hostname;
                location.pathname
                    = defaultLocation.pathname + location.pathname.substr(1);
                location.port = defaultLocation.port;
                location.protocol = defaultLocation.protocol;
            }
            else {
                location = defaultLocation;
            }
        }
        location.protocol || (location.protocol = 'https:');
        const { contextRoot, host, hostname, pathname, room } = location;
        const locationURL = new URL(location.toString());
        const { conference } = (0, functions_1.getConferenceState)(getState());
        if (room) {
            if (conference) {
                // We need to check if the location is the same with the previous one.
                const currentLocationURL = conference?.getConnection()[constants_1.JITSI_CONNECTION_URL_KEY];
                const { hostname: currentHostName, pathname: currentPathName } = currentLocationURL;
                if (currentHostName === hostname && currentPathName === pathname) {
                    logger_1.default.warn(`Joining same conference using URL: ${currentLocationURL}`);
                    return;
                }
            }
            else {
                (0, rootNavigationContainerRef_1.navigateRoot)(routes_1.screen.connecting);
            }
        }
        dispatch((0, actions_native_1.disconnect)());
        dispatch((0, actions_2.configWillLoad)(locationURL, room));
        let protocol = location.protocol.toLowerCase();
        // The React Native app supports an app-specific scheme which is sure to not
        // be supported by fetch.
        protocol !== 'http:' && protocol !== 'https:' && (protocol = 'https:');
        const baseURL = `${protocol}//${host}${contextRoot || '/'}`;
        let url = `${baseURL}config.js`;
        // XXX In order to support multiple shards, tell the room to the deployment.
        room && (url = (0, uri_1.appendURLParam)(url, 'room', (0, uri_1.getBackendSafeRoomName)(room) ?? ''));
        const { release } = (0, parseURLParams_1.parseURLParams)(location, true, 'search');
        release && (url = (0, uri_1.appendURLParam)(url, 'release', release));
        let config;
        // Avoid (re)loading the config when there is no room.
        if (!room) {
            config = (0, functions_native_1.restoreConfig)(baseURL);
        }
        if (!config) {
            try {
                config = await (0, functions_native_2.loadConfig)(url);
                dispatch((0, actions_2.storeConfig)(baseURL, config));
            }
            catch (error) {
                config = (0, functions_native_1.restoreConfig)(baseURL);
                if (!config) {
                    if (room) {
                        dispatch((0, actions_2.loadConfigError)(error, locationURL));
                        return;
                    }
                    // If there is no room (we are on the welcome page), don't fail, just create a fake one.
                    logger_1.default.warn('Failed to load config but there is no room, applying a fake one');
                    config = (0, functions_native_1.createFakeConfig)(baseURL);
                }
            }
        }
        if (getState()['features/base/config'].locationURL !== locationURL) {
            dispatch((0, actions_2.loadConfigError)(new Error('Config no longer needed!'), locationURL));
            return;
        }
        dispatch((0, actions_native_1.setLocationURL)(locationURL));
        dispatch((0, actions_2.setConfig)(config, locationURL));
        dispatch((0, actions_1.setRoom)(room));
        if (!room) {
            (0, rootNavigationContainerRef_1.goBackToRoot)(getState(), dispatch);
            return;
        }
        dispatch((0, actions_native_2.createDesiredLocalTracks)());
        dispatch((0, actions_3.clearNotifications)());
        if (!options.hidePrejoin && (0, functions_2.isPrejoinPageEnabled)(getState())) {
            if ((0, functions_3.isUnsafeRoomWarningEnabled)(getState()) && (0, isInsecureRoomName_1.default)(room)) {
                (0, rootNavigationContainerRef_1.navigateRoot)(routes_1.screen.unsafeRoomWarning);
            }
            else {
                (0, rootNavigationContainerRef_1.navigateRoot)(routes_1.screen.preJoin);
            }
        }
        else {
            dispatch((0, actions_native_1.connect)());
            (0, rootNavigationContainerRef_1.navigateRoot)(routes_1.screen.conference.root);
        }
    };
}
exports.appNavigate = appNavigate;
/**
 * Check if the welcome page is enabled and redirects to it.
 * If requested show a thank you dialog before that.
 * If we have a close page enabled, redirect to it without
 * showing any other dialog.
 *
 * @param {Object} _options - Ignored.
 * @returns {Function}
 */
function maybeRedirectToWelcomePage(_options) {
    // Dummy.
}
exports.maybeRedirectToWelcomePage = maybeRedirectToWelcomePage;
/**
 * Reloads the page.
 *
 * @protected
 * @returns {Function}
 */
function reloadNow() {
    return (dispatch, getState) => {
        const state = getState();
        const { locationURL } = state['features/base/connection'];
        // Preserve the local tracks muted state after the reload.
        // @ts-ignore
        const newURL = (0, functions_native_3.addTrackStateToURL)(locationURL, state);
        const reloadAction = () => {
            logger_1.default.info(`Reloading the conference using URL: ${locationURL}`);
            dispatch(appNavigate((0, uri_1.toURLString)(newURL), {
                hidePrejoin: true
            }));
        };
        if ((0, actions_any_1.maybeRedirectToTokenAuthUrl)(dispatch, getState, reloadAction)) {
            return;
        }
        reloadAction();
    };
}
exports.reloadNow = reloadNow;
