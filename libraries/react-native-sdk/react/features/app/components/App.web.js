"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const react_1 = __importDefault(require("react"));
const GlobalStyles_web_1 = __importDefault(require("../../base/ui/components/GlobalStyles.web"));
const JitsiThemeProvider_web_1 = __importDefault(require("../../base/ui/components/JitsiThemeProvider.web"));
const DialogContainer_1 = __importDefault(require("../../base/ui/components/web/DialogContainer"));
const ChromeExtensionBanner_web_1 = __importDefault(require("../../chrome-extension-banner/components/ChromeExtensionBanner.web"));
const OverlayContainer_1 = __importDefault(require("../../overlay/components/web/OverlayContainer"));
const AbstractApp_1 = require("./AbstractApp");
// Register middlewares and reducers.
require("../middlewares");
require("../reducers");
/**
 * Root app {@code Component} on Web/React.
 *
 * @augments AbstractApp
 */
class App extends AbstractApp_1.AbstractApp {
    /**
     * Creates an extra {@link ReactElement}s to be added (unconditionally)
     * alongside the main element.
     *
     * @abstract
     * @protected
     * @returns {ReactElement}
     */
    _createExtraElement() {
        return (react_1.default.createElement(JitsiThemeProvider_web_1.default, null,
            react_1.default.createElement(OverlayContainer_1.default, null)));
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
            react_1.default.createElement(ChromeExtensionBanner_web_1.default, null),
            super._createMainElement(component, props)));
    }
    /**
     * Renders the platform specific dialog container.
     *
     * @returns {React$Element}
     */
    _renderDialogContainer() {
        return (react_1.default.createElement(JitsiThemeProvider_web_1.default, null,
            react_1.default.createElement(DialogContainer_1.default, null)));
    }
}
exports.App = App;
