"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const BaseApp_1 = __importDefault(require("../../../../base/app/components/BaseApp"));
const utils_1 = require("../../../../base/environment/utils");
const GlobalStyles_web_1 = __importDefault(require("../../../../base/ui/components/GlobalStyles.web"));
const JitsiThemeProvider_web_1 = __importDefault(require("../../../../base/ui/components/JitsiThemeProvider.web"));
const parseURLParams_1 = require("../../../../base/util/parseURLParams");
const constants_1 = require("../../../constants");
const NoRoomError_web_1 = __importDefault(require("../../dial-in-info-page/NoRoomError.web"));
const DialInSummary_1 = __importDefault(require("./DialInSummary"));
/**
 * Wrapper application for prejoin.
 *
 * @augments BaseApp
 */
class DialInSummaryApp extends BaseApp_1.default {
    /**
     * Navigates to {@link Prejoin} upon mount.
     *
     * @returns {void}
     */
    async componentDidMount() {
        await super.componentDidMount();
        // @ts-ignore
        const { room } = (0, parseURLParams_1.parseURLParams)(window.location, true, 'search');
        const { href } = window.location;
        const ix = href.indexOf(constants_1.DIAL_IN_INFO_PAGE_PATH_NAME);
        const url = (ix > 0 ? href.substring(0, ix) : href) + room;
        super._navigate({
            component: () => (react_1.default.createElement(react_1.default.Fragment, null, room
                ? react_1.default.createElement(DialInSummary_1.default, { className: 'dial-in-page', clickableNumbers: (0, utils_1.isMobileBrowser)(), room: decodeURIComponent(room), scrollable: true, showTitle: true, url: url })
                : react_1.default.createElement(NoRoomError_web_1.default, { className: 'dial-in-page' })))
        });
    }
    /**
     * Overrides the parent method to inject {@link AtlasKitThemeProvider} as
     * the top most component.
     *
     * @override
     */
    _createMainElement(component, props) {
        return (react_1.default.createElement(JitsiThemeProvider_web_1.default, null,
            react_1.default.createElement(GlobalStyles_web_1.default, null),
            super._createMainElement(component, props)));
    }
    /**
     * Renders the platform specific dialog container.
     *
     * @returns {React$Element}
     */
    _renderDialogContainer() {
        return null;
    }
}
exports.default = DialInSummaryApp;
