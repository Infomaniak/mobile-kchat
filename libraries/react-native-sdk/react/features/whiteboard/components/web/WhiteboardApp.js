"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const excalidraw_1 = require("@jitsi/excalidraw");
const react_1 = __importDefault(require("react"));
const BaseApp_1 = __importDefault(require("../../../base/app/components/BaseApp"));
const GlobalStyles_web_1 = __importDefault(require("../../../base/ui/components/GlobalStyles.web"));
const JitsiThemeProvider_web_1 = __importDefault(require("../../../base/ui/components/JitsiThemeProvider.web"));
const httpUtils_1 = require("../../../base/util/httpUtils");
const parseURLParams_1 = require("../../../base/util/parseURLParams");
const uri_1 = require("../../../base/util/uri");
const logger_1 = __importDefault(require("../../logger"));
const NoWhiteboardError_1 = __importDefault(require("./NoWhiteboardError"));
const WhiteboardWrapper_1 = __importDefault(require("./WhiteboardWrapper"));
/**
 * Wrapper application for the whiteboard.
 *
 * @augments BaseApp
 */
class WhiteboardApp extends BaseApp_1.default {
    /**
     * Navigates to {@link Whiteboard} upon mount.
     *
     * @returns {void}
     */
    async componentDidMount() {
        await super.componentDidMount();
        const { state } = (0, parseURLParams_1.parseURLParams)(window.location.href, true);
        const decodedState = JSON.parse((0, httpUtils_1.decodeFromBase64URL)(state));
        const { collabServerUrl, localParticipantName } = decodedState;
        let { roomId, roomKey } = decodedState;
        if (!roomId && !roomKey) {
            try {
                const collabDetails = await (0, excalidraw_1.generateCollaborationLinkData)();
                roomId = collabDetails.roomId;
                roomKey = collabDetails.roomKey;
                if (window.ReactNativeWebView) {
                    setTimeout(() => {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            collabDetails,
                            collabServerUrl
                        }));
                    }, 0);
                }
            }
            catch (e) {
                logger_1.default.error('Couldn\'t generate collaboration link data.', e);
            }
        }
        super._navigate({
            component: () => (react_1.default.createElement(react_1.default.Fragment, null, roomId && roomKey && collabServerUrl
                ? react_1.default.createElement(WhiteboardWrapper_1.default, { className: 'whiteboard', collabDetails: {
                        roomId,
                        roomKey
                    }, collabServerUrl: (0, uri_1.safeDecodeURIComponent)(collabServerUrl), localParticipantName: localParticipantName })
                : react_1.default.createElement(NoWhiteboardError_1.default, { className: 'whiteboard' })))
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
exports.default = WhiteboardApp;
