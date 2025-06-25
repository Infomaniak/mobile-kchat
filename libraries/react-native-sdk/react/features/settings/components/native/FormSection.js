"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const functions_1 = require("../../../base/i18n/functions");
const styles_1 = __importDefault(require("./styles"));
/**
 * Section accordion on settings form.
 *
 * @returns {React$Element<any>}
 */
function FormSection({ children, label, t }) {
    return (<react_native_1.View>
            {label && <react_native_1.Text style={styles_1.default.formSectionTitleText}>
                {t(label)}
            </react_native_1.Text>}
            {children}
        </react_native_1.View>);
}
exports.default = (0, functions_1.translate)(FormSection);
