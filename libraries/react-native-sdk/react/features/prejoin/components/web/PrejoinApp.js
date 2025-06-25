"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const BaseApp_1 = __importDefault(require("../../../base/app/components/BaseApp"));
const actions_1 = require("../../../base/config/actions");
const functions_web_1 = require("../../../base/tracks/functions.web");
const GlobalStyles_web_1 = __importDefault(require("../../../base/ui/components/GlobalStyles.web"));
const JitsiThemeProvider_web_1 = __importDefault(require("../../../base/ui/components/JitsiThemeProvider.web"));
const DialogContainer_1 = __importDefault(require("../../../base/ui/components/web/DialogContainer"));
const actions_web_1 = require("../../../conference/actions.web");
const actions_web_2 = require("../../actions.web");
const PrejoinThirdParty_1 = __importDefault(require("./PrejoinThirdParty"));
/**
 * Wrapper application for prejoin.
 *
 * @augments BaseApp
 */
class PrejoinApp extends BaseApp_1.default {
    /**
     * Navigates to {@link Prejoin} upon mount.
     *
     * @returns {void}
     */
    async componentDidMount() {
        await super.componentDidMount();
        const { store } = this.state;
        const { dispatch } = store ?? {};
        const { styleType } = this.props;
        super._navigate({
            component: PrejoinThirdParty_1.default,
            props: {
                className: styleType
            }
        });
        const { startWithAudioMuted, startWithVideoMuted } = store
            ? store.getState()['features/base/settings']
            : { startWithAudioMuted: undefined,
                startWithVideoMuted: undefined };
        const { locationURL } = store
            ? store.getState()['features/base/connection']
            : { locationURL: undefined };
        dispatch?.((0, actions_1.setConfig)({
            prejoinConfig: {
                enabled: true
            },
            startWithAudioMuted,
            startWithVideoMuted
        }, locationURL));
        await dispatch?.((0, actions_web_1.setupInitialDevices)());
        const { tryCreateLocalTracks, errors } = (0, functions_web_1.createPrejoinTracks)();
        const tracks = await tryCreateLocalTracks;
        (0, react_redux_1.batch)(() => {
            dispatch?.((0, actions_web_2.initPrejoin)(tracks, errors));
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
        return (react_1.default.createElement(JitsiThemeProvider_web_1.default, null,
            react_1.default.createElement(DialogContainer_1.default, null)));
    }
}
exports.default = PrejoinApp;
