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
const styles_1 = require("@mui/material/styles");
const React = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const BaseTheme_web_1 = __importDefault(require("./BaseTheme.web"));
/**
 * The theme provider for the web app.
 *
 * @param {Object} props - The props of the component.
 * @returns {React.ReactNode}
 */
function JitsiThemeProvider(props) {
    return (React.createElement(styles_1.StyledEngineProvider, { injectFirst: true },
        React.createElement(styles_1.ThemeProvider, { theme: props._theme }, props.children)));
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { muiBrandedTheme } = state['features/dynamic-branding'];
    return {
        _theme: muiBrandedTheme || BaseTheme_web_1.default
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(JitsiThemeProvider);
