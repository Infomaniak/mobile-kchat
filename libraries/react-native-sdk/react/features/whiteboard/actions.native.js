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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictWhiteboard = void 0;
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const ConferenceNavigationContainerRef_1 = require("../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../mobile/navigation/routes");
const actions_any_1 = require("./actions.any");
__exportStar(require("./actions.any"), exports);
/**
 * Restricts the whiteboard usage.
 *
 * @param {boolean} shouldCloseWhiteboard - Whether to dismiss the whiteboard.
 * @returns {Function}
 */
const restrictWhiteboard = (shouldCloseWhiteboard = true) => (dispatch) => {
    if (shouldCloseWhiteboard) {
        (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.root);
    }
    dispatch((0, actions_any_1.resetWhiteboard)());
    (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRestrictWhiteboardEvent)());
};
exports.restrictWhiteboard = restrictWhiteboard;
