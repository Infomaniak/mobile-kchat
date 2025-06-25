"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._getRouteToRender = void 0;
// @ts-expect-error
const random_1 = require("@jitsi/js-utils/random");
const functions_web_1 = require("../authentication/functions.web");
const functions_1 = require("../base/conference/functions");
const environment_1 = require("../base/environment/environment");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const functions_2 = require("../base/redux/functions");
const uri_1 = require("../base/util/uri");
const Conference_1 = __importDefault(require("../conference/components/web/Conference"));
const functions_3 = require("../deep-linking/functions");
const UnsupportedDesktopBrowser_1 = __importDefault(require("../unsupported-browser/components/UnsupportedDesktopBrowser"));
const BlankPage_web_1 = __importDefault(require("../welcome/components/BlankPage.web"));
const WelcomePage_web_1 = __importDefault(require("../welcome/components/WelcomePage.web"));
const functions_4 = require("../welcome/functions");
/**
 * Determines which route is to be rendered in order to depict a specific Redux
 * store.
 *
 * @param {(Function|Object)} stateful - THe redux store, state, or
 * {@code getState} function.
 * @returns {Promise<Object>}
 */
function _getRouteToRender(stateful) {
    const state = (0, functions_2.toState)(stateful);
    return _getWebConferenceRoute(state) || _getWebWelcomePageRoute(state);
}
exports._getRouteToRender = _getRouteToRender;
/**
 * Returns the {@code Route} to display when trying to access a conference if
 * a valid conference is being joined.
 *
 * @param {Object} state - The redux state.
 * @returns {Promise|undefined}
 */
function _getWebConferenceRoute(state) {
    const room = state['features/base/conference'].room;
    if (!(0, functions_1.isRoomValid)(room)) {
        return;
    }
    const route = _getEmptyRoute();
    const config = state['features/base/config'];
    // if we have auto redirect enabled, and we have previously logged in successfully
    // let's redirect to the auth url to get the token and login again
    if (!lib_jitsi_meet_1.browser.isElectron() && config.tokenAuthUrl && config.tokenAuthUrlAutoRedirect
        && state['features/authentication'].tokenAuthUrlSuccessful
        && !state['features/base/jwt'].jwt && room) {
        const { locationURL = { href: '' } } = state['features/base/connection'];
        const { tenant } = (0, uri_1.parseURIString)(locationURL.href) || {};
        const { startAudioOnly } = config;
        return (0, functions_web_1.getTokenAuthUrl)(config, locationURL, {
            audioMuted: false,
            audioOnlyEnabled: startAudioOnly,
            skipPrejoin: false,
            videoMuted: false
        }, room, tenant)
            .then((url) => {
            route.href = url;
            return route;
        })
            .catch(() => Promise.resolve(route));
    }
    // Update the location if it doesn't match. This happens when a room is
    // joined from the welcome page. The reason for doing this instead of using
    // the history API is that we want to load the config.js which takes the
    // room into account.
    const { locationURL } = state['features/base/connection'];
    if (window.location.href !== locationURL?.href) {
        route.href = locationURL?.href;
        return Promise.resolve(route);
    }
    return (0, functions_3.getDeepLinkingPage)(state)
        .then(deepLinkComponent => {
        if (deepLinkComponent) {
            route.component = deepLinkComponent;
        }
        else if ((0, environment_1.isSupportedBrowser)()) {
            route.component = Conference_1.default;
        }
        else {
            route.component = UnsupportedDesktopBrowser_1.default;
        }
        return route;
    });
}
/**
 * Returns the {@code Route} to display when trying to access the welcome page.
 *
 * @param {Object} state - The redux state.
 * @returns {Promise<Object>}
 */
function _getWebWelcomePageRoute(state) {
    const route = _getEmptyRoute();
    if ((0, functions_4.isWelcomePageEnabled)(state)) {
        if ((0, environment_1.isSupportedBrowser)()) {
            const customLandingPage = (0, functions_4.getCustomLandingPageURL)(state);
            if (customLandingPage) {
                route.href = customLandingPage;
            }
            else {
                route.component = WelcomePage_web_1.default;
            }
        }
        else {
            route.component = UnsupportedDesktopBrowser_1.default;
        }
    }
    else {
        // Web: if the welcome page is disabled, go directly to a random room.
        const url = new URL(window.location.href);
        url.pathname += (0, random_1.generateRoomWithoutSeparator)();
        route.href = url.href;
    }
    return Promise.resolve(route);
}
/**
 * Returns the default {@code Route}.
 *
 * @returns {Object}
 */
function _getEmptyRoute() {
    return {
        component: BlankPage_web_1.default,
        href: undefined
    };
}
