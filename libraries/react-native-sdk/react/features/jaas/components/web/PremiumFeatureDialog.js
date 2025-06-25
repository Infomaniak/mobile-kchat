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
const react_1 = __importStar(require("react"));
const functions_1 = require("../../../base/i18n/functions");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
const openURLInBrowser_web_1 = require("../../../base/util/openURLInBrowser.web");
const constants_1 = require("../../constants");
/**
 * Component that renders the premium feature dialog.
 *
 * @returns {React$Element<any>}
 */
class PremiumFeatureDialog extends react_1.PureComponent {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onSubmitValue = this._onSubmitValue.bind(this);
    }
    /**
     * Callback to be invoked when the dialog ok is pressed.
     *
     * @returns {boolean}
     */
    _onSubmitValue() {
        (0, openURLInBrowser_web_1.openURLInBrowser)(constants_1.JAAS_UPGRADE_URL, true);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { t } = this.props;
        return (react_1.default.createElement(Dialog_1.default, { cancel: { hidden: true }, ok: { translationKey: 'dialog.viewUpgradeOptions' }, onSubmit: this._onSubmitValue, titleKey: t('dialog.viewUpgradeOptionsTitle') },
            react_1.default.createElement("span", null, t('dialog.viewUpgradeOptionsContent'))));
    }
}
exports.default = (0, functions_1.translate)(PremiumFeatureDialog);
