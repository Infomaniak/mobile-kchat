"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._abstractMapStateToProps = exports.isDialogOpen = exports.isAnyDialogOpen = void 0;
const ColorSchemeRegistry_1 = __importDefault(require("../color-scheme/ColorSchemeRegistry"));
const functions_1 = require("../redux/functions");
/**
 * Checks if any {@code Dialog} is currently open.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {boolean}
 */
function isAnyDialogOpen(stateful) {
    return Boolean((0, functions_1.toState)(stateful)['features/base/dialog'].component);
}
exports.isAnyDialogOpen = isAnyDialogOpen;
/**
 * Checks if a {@code Dialog} with a specific {@code component} is currently
 * open.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @param {React.Component} component - The {@code component} of a
 * {@code Dialog} to be checked.
 * @returns {boolean}
 */
function isDialogOpen(stateful, component) {
    return (0, functions_1.toState)(stateful)['features/base/dialog'].component === component;
}
exports.isDialogOpen = isDialogOpen;
/**
 * Maps part of the Redux state to the props of any Dialog based component.
 *
 * @param {IReduxState} state - The Redux state.
 * @returns {{
 *     _dialogStyles: StyleType
 * }}
 */
function _abstractMapStateToProps(state) {
    return {
        _dialogStyles: ColorSchemeRegistry_1.default.get(state, 'Dialog')
    };
}
exports._abstractMapStateToProps = _abstractMapStateToProps;
