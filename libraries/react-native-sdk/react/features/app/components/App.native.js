"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_device_info_1 = __importDefault(require("react-native-device-info"));
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const react_native_splash_screen_1 = __importDefault(require("react-native-splash-screen"));
const BottomSheetContainer_1 = __importDefault(require("../../base/dialog/components/native/BottomSheetContainer"));
const DialogContainer_1 = __importDefault(require("../../base/dialog/components/native/DialogContainer"));
const actions_1 = require("../../base/flags/actions");
const constants_1 = require("../../base/flags/constants");
const actions_2 = require("../../base/responsive-ui/actions");
const DimensionsDetector_native_1 = __importDefault(require("../../base/responsive-ui/components/DimensionsDetector.native"));
const actions_3 = require("../../base/settings/actions");
const JitsiThemeProvider_native_1 = __importDefault(require("../../base/ui/components/JitsiThemeProvider.native"));
const getRouteToRender_native_1 = require("../getRouteToRender.native");
const logger_1 = __importDefault(require("../logger"));
const AbstractApp_1 = require("./AbstractApp");
// Register middlewares and reducers.
require("../middlewares.native");
require("../reducers.native");
const { AppInfo } = react_native_1.NativeModules;
const DialogContainerWrapper = react_native_1.Platform.select({
    default: react_native_1.View
});
/**
 * Root app {@code Component} on mobile/React Native.
 *
 * @augments AbstractApp
 */
class App extends AbstractApp_1.AbstractApp {
    /**
     * Initializes a new {@code App} instance.
     *
     * @param {IProps} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // In the Release configuration, React Native will (intentionally) throw
        // an unhandled JavascriptException for an unhandled JavaScript error.
        // This will effectively kill the app. In accord with the Web, do not
        // kill the app.
        this._maybeDisableExceptionsManager();
        // Bind event handler so it is only bound once per instance.
        this._onDimensionsChanged = this._onDimensionsChanged.bind(this);
        this._onSafeAreaInsetsChanged = this._onSafeAreaInsetsChanged.bind(this);
    }
    /**
     * Initializes the color scheme.
     *
     * @inheritdoc
     *
     * @returns {void}
     */
    async componentDidMount() {
        await super.componentDidMount();
        react_native_splash_screen_1.default.hide();
        const liteTxt = AppInfo.isLiteSDK ? ' (lite)' : '';
        logger_1.default.info(`Loaded SDK ${AppInfo.sdkVersion}${liteTxt}`);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (<JitsiThemeProvider_native_1.default>
                {super.render()}
            </JitsiThemeProvider_native_1.default>);
    }
    /**
     * Initializes feature flags and updates settings.
     *
     * @returns {void}
     */
    async _extraInit() {
        const { dispatch, getState } = this.state.store ?? {};
        const { flags = {}, url, userInfo } = this.props;
        let callIntegrationEnabled = flags[constants_1.CALL_INTEGRATION_ENABLED];
        // CallKit does not work on the simulator, make sure we disable it.
        if (react_native_1.Platform.OS === 'ios' && react_native_device_info_1.default.isEmulatorSync()) {
            flags[constants_1.CALL_INTEGRATION_ENABLED] = false;
            callIntegrationEnabled = false;
            logger_1.default.info('Disabling CallKit because this is a simulator');
        }
        // Disable Android ConnectionService by default.
        if (react_native_1.Platform.OS === 'android' && typeof callIntegrationEnabled === 'undefined') {
            flags[constants_1.CALL_INTEGRATION_ENABLED] = false;
            callIntegrationEnabled = false;
        }
        // We set these early enough so then we avoid any unnecessary re-renders.
        dispatch?.((0, actions_1.updateFlags)(flags));
        const route = await (0, getRouteToRender_native_1._getRouteToRender)();
        // We need the root navigator to be set early.
        await this._navigate(route);
        // HACK ALERT!
        // Wait until the root navigator is ready.
        // We really need to break the inheritance relationship between App,
        // AbstractApp and BaseApp, it's very inflexible and cumbersome right now.
        const rootNavigationReady = new Promise(resolve => {
            const i = setInterval(() => {
                // @ts-ignore
                const { ready } = getState()['features/app'] || {};
                if (ready) {
                    clearInterval(i);
                    resolve();
                }
            }, 50);
        });
        await rootNavigationReady;
        // Update specified server URL.
        if (typeof url !== 'undefined') {
            // @ts-ignore
            const { serverURL } = url;
            if (typeof serverURL !== 'undefined') {
                dispatch?.((0, actions_3.updateSettings)({ serverURL }));
            }
        }
        // @ts-ignore
        dispatch?.((0, actions_3.updateSettings)(userInfo || {}));
        // Update settings with feature-flag.
        if (typeof callIntegrationEnabled !== 'undefined') {
            dispatch?.((0, actions_3.updateSettings)({ disableCallIntegration: !callIntegrationEnabled }));
        }
    }
    /**
     * Overrides the parent method to inject {@link DimensionsDetector} as
     * the top most component.
     *
     * @override
     */
    _createMainElement(component, props) {
        return (<react_native_safe_area_context_1.SafeAreaProvider>
                <DimensionsDetector_native_1.default onDimensionsChanged={this._onDimensionsChanged} onSafeAreaInsetsChanged={this._onSafeAreaInsetsChanged}>
                    {super._createMainElement(component, props)}
                </DimensionsDetector_native_1.default>
            </react_native_safe_area_context_1.SafeAreaProvider>);
    }
    /**
     * Attempts to disable the use of React Native
     * {@link ExceptionsManager#handleException} on platforms and in
     * configurations on/in which the use of the method in questions has been
     * determined to be undesirable. For example, React Native will
     * (intentionally) throw an unhandled {@code JavascriptException} for an
     * unhandled JavaScript error in the Release configuration. This will
     * effectively kill the app. In accord with the Web, do not kill the app.
     *
     * @private
     * @returns {void}
     */
    _maybeDisableExceptionsManager() {
        if (__DEV__) {
            // As mentioned above, only the Release configuration was observed
            // to suffer.
            return;
        }
        if (react_native_1.Platform.OS !== 'android') {
            // A solution based on RTCSetFatalHandler was implemented on iOS and
            // it is preferred because it is at a later step of the
            // error/exception handling and it is specific to fatal
            // errors/exceptions which were observed to kill the app. The
            // solution implemented below was tested on Android only so it is
            // considered safest to use it there only.
            return;
        }
        // @ts-ignore
        const oldHandler = global.ErrorUtils.getGlobalHandler();
        const newHandler = _handleException;
        if (!oldHandler || oldHandler !== newHandler) {
            // @ts-ignore
            newHandler.next = oldHandler;
            // @ts-ignore
            global.ErrorUtils.setGlobalHandler(newHandler);
        }
    }
    /**
     * Updates the known available size for the app to occupy.
     *
     * @param {number} width - The component's current width.
     * @param {number} height - The component's current height.
     * @private
     * @returns {void}
     */
    _onDimensionsChanged(width, height) {
        const { dispatch } = this.state.store ?? {};
        dispatch?.((0, actions_2.clientResized)(width, height));
    }
    /**
     * Updates the safe are insets values.
     *
     * @param {Object} insets - The insets.
     * @param {number} insets.top - The top inset.
     * @param {number} insets.right - The right inset.
     * @param {number} insets.bottom - The bottom inset.
     * @param {number} insets.left - The left inset.
     * @private
     * @returns {void}
     */
    _onSafeAreaInsetsChanged(insets) {
        const { dispatch } = this.state.store ?? {};
        dispatch?.((0, actions_2.setSafeAreaInsets)(insets));
    }
    /**
     * Renders the platform specific dialog container.
     *
     * @returns {React$Element}
     */
    _renderDialogContainer() {
        return (<DialogContainerWrapper pointerEvents='box-none' style={react_native_1.StyleSheet.absoluteFill}>
                <BottomSheetContainer_1.default />
                <DialogContainer_1.default />
            </DialogContainerWrapper>);
    }
}
exports.App = App;
/**
 * Handles a (possibly unhandled) JavaScript error by preventing React Native
 * from converting a fatal error into an unhandled native exception which will
 * kill the app.
 *
 * @param {Error} error - The (possibly unhandled) JavaScript error to handle.
 * @param {boolean} fatal - If the specified error is fatal, {@code true};
 * otherwise, {@code false}.
 * @private
 * @returns {void}
 */
function _handleException(error, fatal) {
    if (fatal) {
        // In the Release configuration, React Native will (intentionally) throw
        // an unhandled JavascriptException for an unhandled JavaScript error.
        // This will effectively kill the app. In accord with the Web, do not
        // kill the app.
        logger_1.default.error(error);
    }
    else {
        // Forward to the next globalHandler of ErrorUtils.
        // @ts-ignore
        const { next } = _handleException;
        typeof next === 'function' && next(error, fatal);
    }
}
