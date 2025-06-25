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
// @ts-expect-error
const API_1 = require("../../../modules/API");
const actions_1 = require("../base/conference/actions");
const actions_2 = require("../base/config/actions");
const actions_web_1 = require("../base/connection/actions.web");
const functions_web_1 = require("../base/lib-jitsi-meet/functions.web");
const iframeUtils_1 = require("../base/util/iframeUtils");
const uri_1 = require("../base/util/uri");
const functions_1 = require("../jaas/functions");
const actions_3 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const functions_2 = require("../welcome/functions");
const actions_any_1 = require("./actions.any");
const functions_web_2 = require("./functions.web");
const logger_1 = __importDefault(require("./logger"));
__exportStar(require("./actions.any"), exports);
/**
 * Triggers an in-app navigation to a specific route. Allows navigation to be
 * abstracted between the mobile/React Native and Web/React applications.
 *
 * @param {string|undefined} uri - The URI to which to navigate. It may be a
 * full URL with an HTTP(S) scheme, a full or partial URI with the app-specific
 * scheme, or a mere room name.
 * @returns {Function}
 */
function appNavigate(uri) {
    return async (dispatch, getState) => {
        let location = (0, uri_1.parseURIString)(uri);
        // If the specified location (URI) does not identify a host, use the app's
        // default.
        if (!location?.host) {
            const defaultLocation = (0, uri_1.parseURIString)((0, functions_web_2.getDefaultURL)(getState));
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
        const { room } = location;
        const locationURL = new URL(location.toString());
        // There are notifications now that gets displayed after we technically left
        // the conference, but we're still on the conference screen.
        dispatch((0, actions_3.clearNotifications)());
        dispatch((0, actions_2.configWillLoad)(locationURL, room));
        const config = await (0, functions_web_1.loadConfig)();
        dispatch((0, actions_web_1.setLocationURL)(locationURL));
        dispatch((0, actions_2.setConfig)(config, locationURL));
        dispatch((0, actions_1.setRoom)(room));
    };
}
exports.appNavigate = appNavigate;
/**
 * Check if the welcome page is enabled and redirects to it.
 * If requested show a thank you dialog before that.
 * If we have a close page enabled, redirect to it without
 * showing any other dialog.
 *
 * @param {Object} options - Used to decide which particular close page to show
 * or if close page is disabled, whether we should show the thankyou dialog.
 * @param {boolean} options.showThankYou - Whether we should
 * show thank you dialog.
 * @param {boolean} options.feedbackSubmitted - Whether feedback was submitted.
 * @returns {Function}
 */
function maybeRedirectToWelcomePage(options = {}) {
    return (dispatch, getState) => {
        const { enableClosePage } = getState()['features/base/config'];
        // if close page is enabled redirect to it, without further action
        if (enableClosePage) {
            if ((0, functions_1.isVpaasMeeting)(getState())) {
                const isOpenedInIframe = (0, iframeUtils_1.inIframe)();
                if (isOpenedInIframe) {
                    // @ts-ignore
                    window.location = 'about:blank';
                }
                else {
                    dispatch((0, actions_any_1.redirectToStaticPage)('/'));
                }
                return;
            }
            const { jwt } = getState()['features/base/jwt'];
            let hashParam;
            // save whether current user is guest or not, and pass auth token,
            // before navigating to close page
            window.sessionStorage.setItem('guest', (!jwt).toString());
            window.sessionStorage.setItem('jwt', jwt ?? '');
            let path = 'close.html';
            if (interfaceConfig.SHOW_PROMOTIONAL_CLOSE_PAGE) {
                if (Number(API_1.API_ID) === API_1.API_ID) {
                    hashParam = `#jitsi_meet_external_api_id=${API_1.API_ID}`;
                }
                path = 'close3.html';
            }
            else if (!options.feedbackSubmitted) {
                path = 'close2.html';
            }
            dispatch((0, actions_any_1.redirectToStaticPage)(`static/${path}`, hashParam));
            return;
        }
        // else: show thankYou dialog only if there is no feedback
        if (options.showThankYou) {
            dispatch((0, actions_3.showNotification)({
                titleArguments: { appName: (0, functions_web_2.getName)() },
                titleKey: 'dialog.thankYou'
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.STICKY));
        }
        // if Welcome page is enabled redirect to welcome page after 3 sec, if
        // there is a thank you message to be shown, 0.5s otherwise.
        if ((0, functions_2.isWelcomePageEnabled)(getState())) {
            setTimeout(() => {
                dispatch((0, actions_any_1.redirectWithStoredParams)('/'));
            }, options.showThankYou ? 3000 : 500);
        }
    };
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
        const reloadAction = () => {
            logger_1.default.info(`Reloading the conference using URL: ${locationURL}`);
            dispatch((0, actions_any_1.reloadWithStoredParams)());
        };
        if ((0, actions_any_1.maybeRedirectToTokenAuthUrl)(dispatch, getState, reloadAction)) {
            return;
        }
        reloadAction();
    };
}
exports.reloadNow = reloadNow;
