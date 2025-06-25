"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goBack = exports.navigate = exports.settingsNavigationContainerRef = void 0;
const react_1 = __importDefault(require("react"));
exports.settingsNavigationContainerRef = react_1.default.createRef();
/**
 * User defined navigation action included inside the reference to the container.
 *
 * @param {string} name - Destination name of the route that has been defined somewhere.
 * @param {Object} params - Params to pass to the destination route.
 * @returns {Function}
 */
function navigate(name, params) {
    return exports.settingsNavigationContainerRef.current?.navigate(name, params);
}
exports.navigate = navigate;
/**
 * User defined navigation action included inside the reference to the container.
 *
 * @returns {Function}
 */
function goBack() {
    return exports.settingsNavigationContainerRef.current?.goBack();
}
exports.goBack = goBack;
