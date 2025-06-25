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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldElectronAPPNotificationDescription = void 0;
const react_1 = __importStar(require("react"));
const functions_1 = require("../../base/i18n/functions");
/**
 * A component that renders the description of the notification for old Jitsi Meet Electron clients.
 *
 * @augments AbstractApp
 */
class OldElectronAPPNotificationDescription extends react_1.Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;
        return (react_1.default.createElement("div", null,
            t('notify.oldElectronClientDescription1'),
            react_1.default.createElement("a", { href: 'https://github.com/jitsi/jitsi-meet-electron/releases/latest', rel: 'noopener noreferrer', target: '_blank' }, t('notify.oldElectronClientDescription2')),
            t('notify.oldElectronClientDescription3')));
    }
}
exports.OldElectronAPPNotificationDescription = OldElectronAPPNotificationDescription;
exports.default = (0, functions_1.translate)(OldElectronAPPNotificationDescription);
