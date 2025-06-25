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
exports.doInvitePeople = void 0;
const functions_1 = require("../base/participants/functions");
const ConferenceNavigationContainerRef_1 = require("../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../mobile/navigation/routes");
const actions_1 = require("../share-room/actions");
__exportStar(require("./actions.any"), exports);
/**
 * Starts the process for inviting people. Depending on the system config it
 * may use the system share sheet or the invite people dialog.
 *
 * @returns {Function}
 */
function doInvitePeople() {
    return (dispatch, getState) => {
        const state = getState();
        if ((0, functions_1.addPeopleFeatureControl)(state)) {
            return (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.invite);
        }
        return dispatch((0, actions_1.beginShareRoom)());
    };
}
exports.doInvitePeople = doInvitePeople;
