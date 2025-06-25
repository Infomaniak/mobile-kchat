"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
StateListenerRegistry_1.default.register(
/* selector */ state => {
    const recentList = state['features/recent-list'];
    // Return the most recent conference entry
    return recentList?.length && recentList[recentList.length - 1];
}, 
// eslint-disable-next-line no-empty-pattern
/* listener */ (newMostRecent, {}, prevMostRecent) => {
    if (prevMostRecent && newMostRecent) {
        // Send the rejoined event just before the duration is reset on the most recent entry
        if (prevMostRecent.conference === newMostRecent.conference && newMostRecent.duration === 0) {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRejoinedEvent)({
                lastConferenceDuration: prevMostRecent.duration / 1000,
                timeSinceLeft: (Date.now() - (prevMostRecent.date + prevMostRecent.duration)) / 1000,
                url: prevMostRecent.conference
            }));
        }
    }
});
