"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._getRouteToRender = void 0;
const RootNavigationContainer_1 = __importDefault(require("../mobile/navigation/components/RootNavigationContainer"));
const route = {
    component: RootNavigationContainer_1.default,
    href: undefined
};
/**
 * Determines which route is to be rendered in order to depict a specific Redux
 * store.
 *
 * @param {any} _stateful - Used on web.
 * @returns {Promise<Object>}
 */
function _getRouteToRender(_stateful) {
    return Promise.resolve(route);
}
exports._getRouteToRender = _getRouteToRender;
