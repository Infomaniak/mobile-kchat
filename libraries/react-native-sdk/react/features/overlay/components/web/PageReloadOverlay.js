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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const AbstractPageReloadOverlay_1 = __importStar(require("./AbstractPageReloadOverlay"));
const OverlayFrame_1 = __importDefault(require("./OverlayFrame"));
/**
 * Implements a React Component for page reload overlay. Shown before the
 * conference is reloaded. Shows a warning message and counts down towards the
 * reload.
 */
class PageReloadOverlay extends AbstractPageReloadOverlay_1.default {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { isNetworkFailure, t } = this.props;
        const { message, timeLeft, title } = this.state;
        return (react_1.default.createElement(OverlayFrame_1.default, { isLightOverlay: isNetworkFailure },
            react_1.default.createElement("div", { "aria-describedby": 'reload_overlay_text', "aria-labelledby": 'reload_overlay_title', className: 'inlay', role: 'dialog' },
                react_1.default.createElement("span", { className: 'reload_overlay_title', id: 'reload_overlay_title', role: 'heading' }, t(title)),
                react_1.default.createElement("span", { className: 'reload_overlay_text', id: 'reload_overlay_text' }, t(message, { seconds: timeLeft })),
                this._renderProgressBar(),
                this._renderButton())));
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractPageReloadOverlay_1.abstractMapStateToProps)(PageReloadOverlay));
