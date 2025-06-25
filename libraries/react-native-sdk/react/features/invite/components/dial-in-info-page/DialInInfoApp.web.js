"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_i18next_1 = require("react-i18next");
const utils_1 = require("../../../base/environment/utils");
const i18next_1 = __importDefault(require("../../../base/i18n/i18next"));
const parseURLParams_1 = require("../../../base/util/parseURLParams");
const constants_1 = require("../../constants");
const DialInSummary_1 = __importDefault(require("../dial-in-summary/web/DialInSummary"));
const NoRoomError_web_1 = __importDefault(require("./NoRoomError.web"));
/**
 * TODO: This seems unused, so we can drop it.
 */
document.addEventListener('DOMContentLoaded', () => {
    // @ts-ignore
    const { room } = (0, parseURLParams_1.parseURLParams)(window.location, true, 'search');
    const { href } = window.location;
    const ix = href.indexOf(constants_1.DIAL_IN_INFO_PAGE_PATH_NAME);
    const url = (ix > 0 ? href.substring(0, ix) : href) + room;
    react_dom_1.default.render(react_1.default.createElement(react_i18next_1.I18nextProvider, { i18n: i18next_1.default }, room
        ? react_1.default.createElement(DialInSummary_1.default, { className: 'dial-in-page', clickableNumbers: (0, utils_1.isMobileBrowser)(), room: decodeURIComponent(room), url: url })
        : react_1.default.createElement(NoRoomError_web_1.default, { className: 'dial-in-page' })), document.getElementById('react'));
});
window.addEventListener('beforeunload', () => {
    react_dom_1.default.unmountComponentAtNode(document.getElementById('react'));
});
