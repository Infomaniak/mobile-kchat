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
exports.HighlightButton = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../../base/i18n/functions");
const svg_1 = require("../../../../base/icons/svg");
const Label_1 = __importDefault(require("../../../../base/label/components/native/Label"));
const BaseTheme_1 = __importDefault(require("../../../../base/ui/components/BaseTheme"));
const AbstractHighlightButton_1 = __importStar(require("../AbstractHighlightButton"));
const styles_native_1 = __importDefault(require("../styles.native"));
/**
 * React {@code Component} responsible for displaying an action that
 * allows users to highlight a meeting moment.
 */
class HighlightButton extends AbstractHighlightButton_1.default {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _disabled, _visible, t } = this.props;
        if (!_visible || _disabled) {
            return null;
        }
        return (<Label_1.default icon={svg_1.IconHighlight} iconColor={BaseTheme_1.default.palette.field01} style={styles_native_1.default.highlightButton} text={t('recording.highlight')} textStyle={styles_native_1.default.highlightButtonText}/>);
    }
}
exports.HighlightButton = HighlightButton;
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractHighlightButton_1._abstractMapStateToProps)(HighlightButton));
