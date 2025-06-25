"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = __importDefault(require("lodash/debounce"));
const functions_1 = require("../base/conference/functions");
const functions_any_1 = require("../base/config/functions.any");
const constants_1 = require("../base/media/constants");
const functions_2 = require("../base/participants/functions");
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const functions_3 = require("../base/tracks/functions");
const helpers_1 = require("../base/util/helpers");
const functions_4 = require("../filmstrip/functions");
const constants_2 = require("../video-layout/constants");
const functions_5 = require("../video-layout/functions");
const actions_1 = require("./actions");
const constants_3 = require("./constants");
const functions_6 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
const selector_1 = require("./selector");
/**
 * Handles changes in the visible participants in the filmstrip. The listener is debounced
 * so that the client doesn't end up sending too many bridge messages when the user is
 * scrolling through the thumbnails prompting updates to the selected endpoints.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/filmstrip'].visibleRemoteParticipants, 
/* listener */ (0, debounce_1.default)((visibleRemoteParticipants, store) => {
    _updateReceiverVideoConstraints(store);
}, 100));
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/tracks'], 
/* listener */ (remoteTracks, store) => {
    _updateReceiverVideoConstraints(store);
});
/**
 * Handles the use case when the on-stage participant has changed.
 */
StateListenerRegistry_1.default.register(state => state['features/large-video'].participantId, (participantId, store) => {
    _updateReceiverVideoConstraints(store);
});
/**
 * Handles the use case when we have set some of the constraints in redux but the conference object wasn't available
 * and we haven't been able to pass the constraints to lib-jitsi-meet.
 */
StateListenerRegistry_1.default.register(state => state['features/base/conference'].conference, (conference, store) => {
    _updateReceiverVideoConstraints(store);
});
/**
 * StateListenerRegistry provides a reliable way of detecting changes to
 * lastn state and dispatching additional actions.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/lastn'].lastN, 
/* listener */ (lastN, store) => {
    _updateReceiverVideoConstraints(store);
});
/**
 * Updates the receiver constraints when the stage participants change.
 */
StateListenerRegistry_1.default.register(state => (0, functions_4.getActiveParticipantsIds)(state).sort(), (_, store) => {
    _updateReceiverVideoConstraints(store);
}, {
    deepEquals: true
});
/**
 * Updates the receiver constraints when new video sources are added to the conference.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/participants'].remoteVideoSources, 
/* listener */ (remoteVideoSources, store) => {
    (0, functions_any_1.getSsrcRewritingFeatureFlag)(store.getState()) && _updateReceiverVideoConstraints(store);
});
/**
 * StateListenerRegistry provides a reliable way of detecting changes to
 * maxReceiverVideoQuality* and preferredVideoQuality state and dispatching additional actions.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => {
    const { maxReceiverVideoQualityForLargeVideo, maxReceiverVideoQualityForScreenSharingFilmstrip, maxReceiverVideoQualityForStageFilmstrip, maxReceiverVideoQualityForTileView, maxReceiverVideoQualityForVerticalFilmstrip, preferredVideoQuality } = state['features/video-quality'];
    return {
        maxReceiverVideoQualityForLargeVideo,
        maxReceiverVideoQualityForScreenSharingFilmstrip,
        maxReceiverVideoQualityForStageFilmstrip,
        maxReceiverVideoQualityForTileView,
        maxReceiverVideoQualityForVerticalFilmstrip,
        preferredVideoQuality
    };
}, 
/* listener */ (currentState, store, previousState = {}) => {
    const { preferredVideoQuality } = currentState;
    const changedPreferredVideoQuality = preferredVideoQuality !== previousState.preferredVideoQuality;
    if (changedPreferredVideoQuality) {
        _setSenderVideoConstraint(preferredVideoQuality, store);
        typeof APP !== 'undefined' && APP.API.notifyVideoQualityChanged(preferredVideoQuality);
    }
    _updateReceiverVideoConstraints(store);
}, {
    deepEquals: true
});
/**
 * Implements a state listener in order to calculate max receiver video quality.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => {
    const { reducedUI } = state['features/base/responsive-ui'];
    const _shouldDisplayTileView = (0, functions_5.shouldDisplayTileView)(state);
    const tileViewThumbnailSize = state['features/filmstrip']?.tileViewDimensions?.thumbnailSize;
    const { visibleRemoteParticipants } = state['features/filmstrip'];
    const { height: largeVideoHeight } = state['features/large-video'];
    const activeParticipantsIds = (0, functions_4.getActiveParticipantsIds)(state);
    const { screenshareFilmstripDimensions: { thumbnailSize } } = state['features/filmstrip'];
    const screenshareFilmstripParticipantId = (0, functions_4.getScreenshareFilmstripParticipantId)(state);
    return {
        activeParticipantsCount: activeParticipantsIds?.length,
        displayTileView: _shouldDisplayTileView,
        largeVideoHeight,
        participantCount: visibleRemoteParticipants?.size || 0,
        reducedUI,
        screenSharingFilmstripHeight: screenshareFilmstripParticipantId && (0, functions_5.getCurrentLayout)(state) === constants_2.LAYOUTS.STAGE_FILMSTRIP_VIEW
            ? thumbnailSize?.height : undefined,
        stageFilmstripThumbnailHeight: state['features/filmstrip'].stageFilmstripDimensions?.thumbnailSize?.height,
        tileViewThumbnailHeight: tileViewThumbnailSize?.height,
        verticalFilmstripThumbnailHeight: state['features/filmstrip'].verticalViewDimensions?.gridView?.thumbnailSize?.height
    };
}, 
/* listener */ ({ activeParticipantsCount, displayTileView, largeVideoHeight, participantCount, reducedUI, screenSharingFilmstripHeight, stageFilmstripThumbnailHeight, tileViewThumbnailHeight, verticalFilmstripThumbnailHeight }, store, previousState = {}) => {
    const { dispatch, getState } = store;
    const state = getState();
    const { maxReceiverVideoQualityForLargeVideo, maxReceiverVideoQualityForScreenSharingFilmstrip, maxReceiverVideoQualityForStageFilmstrip, maxReceiverVideoQualityForTileView, maxReceiverVideoQualityForVerticalFilmstrip } = state['features/video-quality'];
    const { maxFullResolutionParticipants = 2 } = state['features/base/config'];
    let maxVideoQualityChanged = false;
    if (displayTileView) {
        let newMaxRecvVideoQuality = constants_3.VIDEO_QUALITY_LEVELS.STANDARD;
        if (reducedUI) {
            newMaxRecvVideoQuality = constants_3.VIDEO_QUALITY_LEVELS.LOW;
        }
        else if (typeof tileViewThumbnailHeight === 'number' && !Number.isNaN(tileViewThumbnailHeight)) {
            newMaxRecvVideoQuality
                = (0, functions_6.getReceiverVideoQualityLevel)(tileViewThumbnailHeight, (0, selector_1.getMinHeightForQualityLvlMap)(state));
            // Override HD level calculated for the thumbnail height when # of participants threshold is exceeded
            if (maxFullResolutionParticipants !== -1) {
                const override = participantCount > maxFullResolutionParticipants
                    && newMaxRecvVideoQuality > constants_3.VIDEO_QUALITY_LEVELS.STANDARD;
                logger_1.default.info(`Video quality level for thumbnail height: ${tileViewThumbnailHeight}, `
                    + `is: ${newMaxRecvVideoQuality}, `
                    + `override: ${String(override)}, `
                    + `max full res N: ${maxFullResolutionParticipants}`);
                if (override) {
                    newMaxRecvVideoQuality = constants_3.VIDEO_QUALITY_LEVELS.STANDARD;
                }
            }
        }
        if (maxReceiverVideoQualityForTileView !== newMaxRecvVideoQuality) {
            maxVideoQualityChanged = true;
            dispatch((0, actions_1.setMaxReceiverVideoQualityForTileView)(newMaxRecvVideoQuality));
        }
    }
    else {
        let newMaxRecvVideoQualityForStageFilmstrip;
        let newMaxRecvVideoQualityForVerticalFilmstrip;
        let newMaxRecvVideoQualityForLargeVideo;
        let newMaxRecvVideoQualityForScreenSharingFilmstrip;
        if (reducedUI) {
            newMaxRecvVideoQualityForVerticalFilmstrip
                = newMaxRecvVideoQualityForStageFilmstrip
                    = newMaxRecvVideoQualityForLargeVideo
                        = newMaxRecvVideoQualityForScreenSharingFilmstrip
                            = constants_3.VIDEO_QUALITY_LEVELS.LOW;
        }
        else {
            newMaxRecvVideoQualityForStageFilmstrip
                = (0, functions_5.getVideoQualityForStageThumbnails)(stageFilmstripThumbnailHeight, state);
            newMaxRecvVideoQualityForVerticalFilmstrip
                = (0, functions_5.getVideoQualityForResizableFilmstripThumbnails)(verticalFilmstripThumbnailHeight, state);
            newMaxRecvVideoQualityForLargeVideo = (0, functions_5.getVideoQualityForLargeVideo)(largeVideoHeight);
            newMaxRecvVideoQualityForScreenSharingFilmstrip
                = (0, functions_5.getVideoQualityForScreenSharingFilmstrip)(screenSharingFilmstripHeight, state);
            // Override HD level calculated for the thumbnail height when # of participants threshold is exceeded
            if (maxFullResolutionParticipants !== -1) {
                if (activeParticipantsCount > 0
                    && newMaxRecvVideoQualityForStageFilmstrip > constants_3.VIDEO_QUALITY_LEVELS.STANDARD) {
                    const isScreenSharingFilmstripParticipantFullResolution = newMaxRecvVideoQualityForScreenSharingFilmstrip > constants_3.VIDEO_QUALITY_LEVELS.STANDARD;
                    if (activeParticipantsCount > maxFullResolutionParticipants
                        - (isScreenSharingFilmstripParticipantFullResolution ? 1 : 0)) {
                        newMaxRecvVideoQualityForStageFilmstrip = constants_3.VIDEO_QUALITY_LEVELS.STANDARD;
                        newMaxRecvVideoQualityForVerticalFilmstrip
                            = Math.min(constants_3.VIDEO_QUALITY_LEVELS.STANDARD, newMaxRecvVideoQualityForVerticalFilmstrip);
                    }
                    else if (newMaxRecvVideoQualityForVerticalFilmstrip > constants_3.VIDEO_QUALITY_LEVELS.STANDARD
                        && participantCount > maxFullResolutionParticipants - activeParticipantsCount) {
                        newMaxRecvVideoQualityForVerticalFilmstrip = constants_3.VIDEO_QUALITY_LEVELS.STANDARD;
                    }
                }
                else if (newMaxRecvVideoQualityForVerticalFilmstrip > constants_3.VIDEO_QUALITY_LEVELS.STANDARD
                    && participantCount > maxFullResolutionParticipants
                        - (newMaxRecvVideoQualityForLargeVideo > constants_3.VIDEO_QUALITY_LEVELS.STANDARD ? 1 : 0)) {
                    newMaxRecvVideoQualityForVerticalFilmstrip = constants_3.VIDEO_QUALITY_LEVELS.STANDARD;
                }
            }
        }
        if (maxReceiverVideoQualityForStageFilmstrip !== newMaxRecvVideoQualityForStageFilmstrip) {
            maxVideoQualityChanged = true;
            dispatch((0, actions_1.setMaxReceiverVideoQualityForStageFilmstrip)(newMaxRecvVideoQualityForStageFilmstrip));
        }
        if (maxReceiverVideoQualityForVerticalFilmstrip !== newMaxRecvVideoQualityForVerticalFilmstrip) {
            maxVideoQualityChanged = true;
            dispatch((0, actions_1.setMaxReceiverVideoQualityForVerticalFilmstrip)(newMaxRecvVideoQualityForVerticalFilmstrip));
        }
        if (maxReceiverVideoQualityForLargeVideo !== newMaxRecvVideoQualityForLargeVideo) {
            maxVideoQualityChanged = true;
            dispatch((0, actions_1.setMaxReceiverVideoQualityForLargeVideo)(newMaxRecvVideoQualityForLargeVideo));
        }
        if (maxReceiverVideoQualityForScreenSharingFilmstrip !== newMaxRecvVideoQualityForScreenSharingFilmstrip) {
            maxVideoQualityChanged = true;
            dispatch((0, actions_1.setMaxReceiverVideoQualityForScreenSharingFilmstrip)(newMaxRecvVideoQualityForScreenSharingFilmstrip));
        }
    }
    if (!maxVideoQualityChanged && Boolean(displayTileView) !== Boolean(previousState.displayTileView)) {
        _updateReceiverVideoConstraints(store);
    }
}, {
    deepEquals: true
});
/**
 * Returns the source names asociated with the given participants list.
 *
 * @param {Array<string>} participantList - The list of participants.
 * @param {Object} state - The redux state.
 * @returns {Array<string>}
 */
function _getSourceNames(participantList, state) {
    const { remoteScreenShares } = state['features/video-layout'];
    const tracks = state['features/base/tracks'];
    const sourceNamesList = [];
    participantList.forEach(participantId => {
        if ((0, functions_any_1.getSsrcRewritingFeatureFlag)(state)) {
            const sourceNames = (0, functions_2.getSourceNamesByMediaTypeAndParticipant)(state, participantId, constants_1.MEDIA_TYPE.VIDEO);
            sourceNames.length && sourceNamesList.push(...sourceNames);
        }
        else {
            let sourceName;
            if (remoteScreenShares.includes(participantId)) {
                sourceName = participantId;
            }
            else {
                sourceName = (0, functions_3.getTrackSourceNameByMediaTypeAndParticipant)(tracks, constants_1.MEDIA_TYPE.VIDEO, participantId);
            }
            if (sourceName) {
                sourceNamesList.push(sourceName);
            }
        }
    });
    return sourceNamesList;
}
/**
 * Helper function for updating the preferred sender video constraint, based on the user preference.
 *
 * @param {number} preferred - The user preferred max frame height.
 * @returns {void}
 */
function _setSenderVideoConstraint(preferred, { getState }) {
    const state = getState();
    const { conference } = state['features/base/conference'];
    if (!conference) {
        return;
    }
    logger_1.default.info(`Setting sender resolution to ${preferred}`);
    conference.setSenderVideoConstraint(preferred)
        .catch((error) => {
        (0, functions_1._handleParticipantError)(error);
        (0, helpers_1.reportError)(error, `Changing sender resolution to ${preferred} failed.`);
    });
}
/**
 * Private helper to calculate the receiver video constraints and set them on the bridge channel.
 *
 * @param {*} store - The redux store.
 * @returns {void}
 */
function _updateReceiverVideoConstraints({ getState }) {
    const state = getState();
    const { conference } = state['features/base/conference'];
    if (!conference) {
        return;
    }
    const { lastN } = state['features/base/lastn'];
    const { maxReceiverVideoQualityForTileView, maxReceiverVideoQualityForStageFilmstrip, maxReceiverVideoQualityForVerticalFilmstrip, maxReceiverVideoQualityForLargeVideo, maxReceiverVideoQualityForScreenSharingFilmstrip, preferredVideoQuality } = state['features/video-quality'];
    const { participantId: largeVideoParticipantId = '' } = state['features/large-video'];
    const maxFrameHeightForTileView = Math.min(maxReceiverVideoQualityForTileView, preferredVideoQuality);
    const maxFrameHeightForStageFilmstrip = Math.min(maxReceiverVideoQualityForStageFilmstrip, preferredVideoQuality);
    const maxFrameHeightForVerticalFilmstrip = Math.min(maxReceiverVideoQualityForVerticalFilmstrip, preferredVideoQuality);
    const maxFrameHeightForLargeVideo = Math.min(maxReceiverVideoQualityForLargeVideo, preferredVideoQuality);
    const maxFrameHeightForScreenSharingFilmstrip = Math.min(maxReceiverVideoQualityForScreenSharingFilmstrip, preferredVideoQuality);
    const { remoteScreenShares } = state['features/video-layout'];
    const { visibleRemoteParticipants } = state['features/filmstrip'];
    const tracks = state['features/base/tracks'];
    const localParticipantId = (0, functions_2.getLocalParticipant)(state)?.id;
    const activeParticipantsIds = (0, functions_4.getActiveParticipantsIds)(state);
    const screenshareFilmstripParticipantId = (0, functions_4.isTopPanelEnabled)(state) && (0, functions_4.getScreenshareFilmstripParticipantId)(state);
    const receiverConstraints = {
        constraints: {},
        defaultConstraints: { 'maxHeight': constants_3.VIDEO_QUALITY_LEVELS.NONE },
        lastN
    };
    let activeParticipantsSources = [];
    let visibleRemoteTrackSourceNames = [];
    let largeVideoSourceName;
    receiverConstraints.onStageSources = [];
    receiverConstraints.selectedSources = [];
    if (visibleRemoteParticipants?.size) {
        visibleRemoteTrackSourceNames = _getSourceNames(Array.from(visibleRemoteParticipants), state);
    }
    if (activeParticipantsIds?.length > 0) {
        activeParticipantsSources = _getSourceNames(activeParticipantsIds, state);
    }
    if (localParticipantId !== largeVideoParticipantId) {
        if (remoteScreenShares.includes(largeVideoParticipantId)) {
            largeVideoSourceName = largeVideoParticipantId;
        }
        else {
            largeVideoSourceName = (0, functions_any_1.getSsrcRewritingFeatureFlag)(state)
                ? (0, functions_2.getSourceNamesByVideoTypeAndParticipant)(state, largeVideoParticipantId, constants_1.VIDEO_TYPE.CAMERA)[0]
                : (0, functions_3.getTrackSourceNameByMediaTypeAndParticipant)(tracks, constants_1.MEDIA_TYPE.VIDEO, largeVideoParticipantId);
        }
    }
    // Tile view.
    if ((0, functions_5.shouldDisplayTileView)(state)) {
        if (!visibleRemoteTrackSourceNames?.length) {
            return;
        }
        visibleRemoteTrackSourceNames.forEach(sourceName => {
            receiverConstraints.constraints[sourceName] = { 'maxHeight': maxFrameHeightForTileView };
        });
        // Prioritize screenshare in tile view.
        if (remoteScreenShares?.length) {
            receiverConstraints.selectedSources = remoteScreenShares;
        }
        // Stage view.
    }
    else {
        if (!visibleRemoteTrackSourceNames?.length && !largeVideoSourceName && !activeParticipantsSources?.length) {
            return;
        }
        if (visibleRemoteTrackSourceNames?.length) {
            visibleRemoteTrackSourceNames.forEach(sourceName => {
                receiverConstraints.constraints[sourceName] = { 'maxHeight': maxFrameHeightForVerticalFilmstrip };
            });
        }
        if ((0, functions_5.getCurrentLayout)(state) === constants_2.LAYOUTS.STAGE_FILMSTRIP_VIEW && activeParticipantsSources.length > 0) {
            const selectedSources = [];
            const onStageSources = [];
            // If more than one video source is pinned to the stage filmstrip, they need to be added to the
            // 'selectedSources' so that the bridge can allocate bandwidth for all the sources as opposed to doing
            // greedy allocation for the sources (which happens when they are added to 'onStageSources').
            if (activeParticipantsSources.length > 1) {
                selectedSources.push(...activeParticipantsSources);
            }
            else {
                onStageSources.push(activeParticipantsSources[0]);
            }
            activeParticipantsSources.forEach(sourceName => {
                const isScreenSharing = remoteScreenShares.includes(sourceName);
                const quality = isScreenSharing && preferredVideoQuality >= constants_3.MAX_VIDEO_QUALITY
                    ? constants_3.VIDEO_QUALITY_UNLIMITED : maxFrameHeightForStageFilmstrip;
                receiverConstraints.constraints[sourceName] = { 'maxHeight': quality };
            });
            if (screenshareFilmstripParticipantId) {
                onStageSources.push(screenshareFilmstripParticipantId);
                receiverConstraints.constraints[screenshareFilmstripParticipantId]
                    = {
                        'maxHeight': preferredVideoQuality >= constants_3.MAX_VIDEO_QUALITY
                            ? constants_3.VIDEO_QUALITY_UNLIMITED : maxFrameHeightForScreenSharingFilmstrip
                    };
            }
            receiverConstraints.onStageSources = onStageSources;
            receiverConstraints.selectedSources = selectedSources;
        }
        else if (largeVideoSourceName) {
            let quality = constants_3.VIDEO_QUALITY_UNLIMITED;
            if (preferredVideoQuality < constants_3.MAX_VIDEO_QUALITY
                || !remoteScreenShares.find(id => id === largeVideoParticipantId)) {
                quality = maxFrameHeightForLargeVideo;
            }
            receiverConstraints.constraints[largeVideoSourceName] = { 'maxHeight': quality };
            receiverConstraints.onStageSources = [largeVideoSourceName];
        }
    }
    try {
        conference.setReceiverConstraints(receiverConstraints);
    }
    catch (error) {
        (0, functions_1._handleParticipantError)(error);
        (0, helpers_1.reportError)(error, `Failed to set receiver video constraints ${JSON.stringify(receiverConstraints)}`);
    }
}
