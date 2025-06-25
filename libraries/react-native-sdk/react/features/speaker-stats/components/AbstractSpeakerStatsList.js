"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../base/participants/functions");
const actions_any_1 = require("../actions.any");
const constants_1 = require("../constants");
/**
 * Component that renders the list of speaker stats.
 *
 * @param {Function} speakerStatsItem - React element tu use when rendering.
 * @param {Object} itemStyles - Styles for the speaker stats item.
 * @returns {Function}
 */
const abstractSpeakerStatsList = (speakerStatsItem) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const { conference } = (0, react_redux_1.useSelector)((state) => state['features/base/conference']);
    const { stats: speakerStats, showFaceExpressions, sortedSpeakerStatsIds } = (0, react_redux_1.useSelector)((state) => state['features/speaker-stats']);
    const localParticipant = (0, react_redux_1.useSelector)(functions_1.getLocalParticipant);
    const { defaultRemoteDisplayName } = (0, react_redux_1.useSelector)((state) => state['features/base/config']) || {};
    const { faceLandmarks: faceLandmarksConfig } = (0, react_redux_1.useSelector)((state) => state['features/base/config']) || {};
    const { faceLandmarks } = (0, react_redux_1.useSelector)((state) => state['features/face-landmarks'])
        || { faceLandmarks: [] };
    const reloadInterval = (0, react_1.useRef)();
    /**
     * Update the internal state with the latest speaker stats.
     *
     * @returns {Object}
     * @private
     */
    const getSpeakerStats = (0, react_1.useCallback)(() => {
        const stats = conference?.getSpeakerStats();
        for (const userId in stats) {
            if (stats[userId]) {
                if (stats[userId].isLocalStats()) {
                    const meString = t('me');
                    stats[userId].setDisplayName(localParticipant?.name
                        ? `${localParticipant.name} (${meString})`
                        : meString);
                    if (faceLandmarksConfig?.enableDisplayFaceExpressions) {
                        stats[userId].setFaceLandmarks(faceLandmarks);
                    }
                }
                if (!stats[userId].getDisplayName()) {
                    stats[userId].setDisplayName(conference?.getParticipantById(userId)?.name);
                }
            }
        }
        return stats ?? {};
    }, [faceLandmarks]);
    const updateStats = (0, react_1.useCallback)(() => dispatch((0, actions_any_1.initUpdateStats)(getSpeakerStats)), [dispatch, actions_any_1.initUpdateStats, getSpeakerStats]);
    (0, react_1.useEffect)(() => {
        reloadInterval.current = window.setInterval(() => {
            updateStats();
        }, constants_1.SPEAKER_STATS_RELOAD_INTERVAL);
        return () => {
            if (reloadInterval.current) {
                clearInterval(reloadInterval.current);
            }
        };
    }, [faceLandmarks]);
    const localSpeakerStats = Object.keys(speakerStats).length === 0 ? getSpeakerStats() : speakerStats;
    const localSortedSpeakerStatsIds = sortedSpeakerStatsIds.length === 0 ? Object.keys(localSpeakerStats) : sortedSpeakerStatsIds;
    const userIds = localSortedSpeakerStatsIds.filter(id => localSpeakerStats[id] && !localSpeakerStats[id].hidden);
    return userIds.map(userId => {
        const statsModel = localSpeakerStats[userId];
        const props = {
            isDominantSpeaker: statsModel.isDominantSpeaker(),
            dominantSpeakerTime: statsModel.getTotalDominantSpeakerTime(),
            participantId: userId,
            hasLeft: statsModel.hasLeft(),
            faceLandmarks: showFaceExpressions ? statsModel.getFaceLandmarks() : undefined,
            hidden: statsModel.hidden,
            showFaceExpressions,
            displayName: statsModel.getDisplayName() || defaultRemoteDisplayName,
            t
        };
        return speakerStatsItem(props);
    });
};
exports.default = abstractSpeakerStatsList;
