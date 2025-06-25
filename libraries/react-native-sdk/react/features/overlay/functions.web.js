"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverlayToRender = void 0;
const PageReloadOverlay_1 = __importDefault(require("./components/web/PageReloadOverlay"));
const SuspendedOverlay_1 = __importDefault(require("./components/web/SuspendedOverlay"));
const UserMediaPermissionsOverlay_1 = __importDefault(require("./components/web/UserMediaPermissionsOverlay"));
/**
 * Returns the overlay to be currently rendered.
 *
 * @param {IReduxState} state - The Redux state.
 * @returns {?React$ComponentType<*>}
 */
function getOverlayToRender(state) {
    const overlays = [
        PageReloadOverlay_1.default,
        SuspendedOverlay_1.default,
        UserMediaPermissionsOverlay_1.default
    ];
    for (const overlay of overlays) {
        // react-i18n / react-redux wrap components and thus we cannot access
        // the wrapped component's static methods directly.
        // @ts-ignore
        const component = overlay.WrappedComponent || overlay;
        if (component.needsRender(state)) {
            return overlay;
        }
    }
    return undefined;
}
exports.getOverlayToRender = getOverlayToRender;
