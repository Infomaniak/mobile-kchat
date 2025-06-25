"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConferenceInfo = void 0;
const constants_1 = require("./constants");
/**
 * Retrieves the conference info labels based on config values and defaults.
 *
 * @param {Object} state - The redux state.
 * @returns {Object} The conferenceInfo object.
 */
const getConferenceInfo = (state) => {
    const { conferenceInfo } = state['features/base/config'];
    if (conferenceInfo) {
        return {
            alwaysVisible: conferenceInfo.alwaysVisible ?? constants_1.CONFERENCE_INFO.alwaysVisible,
            autoHide: conferenceInfo.autoHide ?? constants_1.CONFERENCE_INFO.autoHide
        };
    }
    return constants_1.CONFERENCE_INFO;
};
exports.getConferenceInfo = getConferenceInfo;
