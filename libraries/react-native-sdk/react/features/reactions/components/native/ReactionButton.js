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
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const functions_2 = require("../../../base/i18n/functions");
const actions_any_1 = require("../../actions.any");
const constants_1 = require("../../constants");
/**
 * An implementation of a button to send a reaction.
 *
 * @returns {ReactElement}
 */
function ReactionButton({ children, onClick, styles, reaction, t }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const _onClick = (0, react_1.useCallback)(() => {
        if (reaction) {
            dispatch((0, actions_any_1.addReactionToBuffer)(reaction));
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createReactionMenuEvent)(reaction));
        }
    }, [reaction]);
    return (<react_native_1.TouchableHighlight accessibilityLabel={t(`toolbar.accessibilityLabel.${reaction}`)} accessibilityRole='button' onPress={onClick || _onClick} style={[styles.style, children && styles?.gifButton]} underlayColor={styles.underlayColor}>
            {children ?? <react_native_1.Text style={styles.emoji}>{constants_1.REACTIONS[reaction ?? ''].emoji}</react_native_1.Text>}
        </react_native_1.TouchableHighlight>);
}
exports.default = (0, functions_2.translate)(ReactionButton);
