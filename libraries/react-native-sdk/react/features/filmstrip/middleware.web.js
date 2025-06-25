"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
// @ts-expect-error
const VideoLayout_1 = __importDefault(require("../../../modules/UI/videolayout/VideoLayout"));
const actionTypes_1 = require("../base/participants/actionTypes");
const functions_1 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_2 = require("../base/responsive-ui/actionTypes");
const actionTypes_3 = require("../base/settings/actionTypes");
const actions_web_1 = require("../video-layout/actions.web");
const constants_1 = require("../video-layout/constants");
const functions_web_1 = require("../video-layout/functions.web");
const constants_2 = require("../whiteboard/constants");
const functions_2 = require("../whiteboard/functions");
const actionTypes_4 = require("./actionTypes");
const actions_web_2 = require("./actions.web");
const constants_3 = require("./constants");
const functions_web_2 = require("./functions.web");
require("./subscriber.web");
/**
 * Map of timers.
 *
 * @type {Map}
 */
const timers = new Map();
/**
 * The middleware of the feature Filmstrip.
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    if (action.type === actionTypes_1.PARTICIPANT_LEFT) {
        // This has to be executed before we remove the participant from features/base/participants state in order to
        // remove the related thumbnail component before we need to re-render it. If we do this after next()
        // we will be in situation where the participant exists in the remoteParticipants array in features/filmstrip
        // but doesn't exist in features/base/participants state which will lead to rendering a thumbnail for
        // non-existing participant.
        (0, functions_web_2.updateRemoteParticipantsOnLeave)(store, action.participant?.id);
    }
    let result;
    switch (action.type) {
        case actionTypes_2.CLIENT_RESIZED: {
            const state = store.getState();
            if ((0, functions_web_2.isFilmstripResizable)(state)) {
                const { width: filmstripWidth, topPanelHeight } = state['features/filmstrip'];
                const { clientWidth, clientHeight } = action;
                let height, width;
                if ((filmstripWidth.current ?? 0) > clientWidth - constants_3.MIN_STAGE_VIEW_WIDTH) {
                    width = Math.max(clientWidth - constants_3.MIN_STAGE_VIEW_WIDTH, constants_3.DEFAULT_FILMSTRIP_WIDTH);
                }
                else {
                    width = Math.min(clientWidth - constants_3.MIN_STAGE_VIEW_WIDTH, filmstripWidth.userSet ?? 0);
                }
                if (width !== filmstripWidth.current) {
                    store.dispatch((0, actions_web_2.setFilmstripWidth)(width));
                }
                if ((topPanelHeight.current ?? 0) > clientHeight - constants_3.MIN_STAGE_VIEW_HEIGHT) {
                    height = Math.max(clientHeight - constants_3.MIN_STAGE_VIEW_HEIGHT, constants_3.TOP_FILMSTRIP_HEIGHT);
                }
                else {
                    height = Math.min(clientHeight - constants_3.MIN_STAGE_VIEW_HEIGHT, topPanelHeight.userSet ?? 0);
                }
                if (height !== topPanelHeight.current) {
                    store.dispatch((0, actions_web_2.setFilmstripHeight)(height));
                }
            }
            break;
        }
        case actionTypes_1.PARTICIPANT_JOINED: {
            result = next(action);
            if ((0, functions_1.isScreenShareParticipant)(action.participant)) {
                break;
            }
            (0, functions_web_2.updateRemoteParticipants)(store, false, action.participant?.id);
            break;
        }
        case actionTypes_3.SETTINGS_UPDATED: {
            if (typeof action.settings?.localFlipX === 'boolean') {
                // TODO: This needs to be removed once the large video is Reactified.
                VideoLayout_1.default.onLocalFlipXChanged(action.settings.localFlipX);
            }
            if (action.settings?.disableSelfView) {
                const state = store.getState();
                const local = (0, functions_1.getLocalParticipant)(state);
                const localScreenShare = (0, functions_1.getLocalScreenShareParticipant)(state);
                const activeParticipantsIds = (0, functions_web_2.getActiveParticipantsIds)(state);
                if (activeParticipantsIds.find(id => id === local?.id)) {
                    store.dispatch((0, actions_web_2.removeStageParticipant)(local?.id ?? ''));
                }
                if (localScreenShare) {
                    if (activeParticipantsIds.find(id => id === localScreenShare.id)) {
                        store.dispatch((0, actions_web_2.removeStageParticipant)(localScreenShare.id));
                    }
                }
            }
            if (action.settings?.maxStageParticipants !== undefined) {
                const maxParticipants = action.settings.maxStageParticipants;
                const { activeParticipants } = store.getState()['features/filmstrip'];
                const newMax = Math.min(constants_3.MAX_ACTIVE_PARTICIPANTS, maxParticipants);
                if (newMax < activeParticipants.length) {
                    const toRemove = activeParticipants.slice(0, activeParticipants.length - newMax);
                    (0, react_redux_1.batch)(() => {
                        toRemove.forEach(p => store.dispatch((0, actions_web_2.removeStageParticipant)(p.participantId)));
                    });
                }
            }
            break;
        }
        case actionTypes_4.SET_USER_FILMSTRIP_WIDTH: {
            VideoLayout_1.default.refreshLayout();
            break;
        }
        case actionTypes_4.RESIZE_FILMSTRIP: {
            const { width = 0 } = action;
            store.dispatch((0, actions_web_2.setFilmstripWidth)(width));
            break;
        }
        case actionTypes_4.ADD_STAGE_PARTICIPANT: {
            const { dispatch, getState } = store;
            const { participantId, pinned } = action;
            const state = getState();
            const { activeParticipants } = state['features/filmstrip'];
            const { maxStageParticipants } = state['features/base/settings'];
            const isWhiteboardActive = (0, functions_2.isWhiteboardVisible)(state);
            let queue;
            if (activeParticipants.find(p => p.participantId === participantId)) {
                queue = activeParticipants.filter(p => p.participantId !== participantId);
                queue.push({
                    participantId,
                    pinned
                });
                const tid = timers.get(participantId);
                clearTimeout(tid);
                timers.delete(participantId);
            }
            else if (activeParticipants.length < (maxStageParticipants ?? 0)) {
                queue = [...activeParticipants, {
                        participantId,
                        pinned
                    }];
            }
            else {
                const notPinnedIndex = activeParticipants.findIndex(p => !p.pinned);
                if (notPinnedIndex === -1) {
                    if (pinned) {
                        queue = [...activeParticipants, {
                                participantId,
                                pinned
                            }];
                        queue.shift();
                    }
                }
                else {
                    queue = [...activeParticipants, {
                            participantId,
                            pinned
                        }];
                    queue.splice(notPinnedIndex, 1);
                }
            }
            if (participantId === constants_2.WHITEBOARD_ID) {
                // If the whiteboard is pinned, this action should clear the other pins.
                queue = [{
                        participantId,
                        pinned: true
                    }];
            }
            else if (isWhiteboardActive && Array.isArray(queue)) {
                // When another participant is pinned, remove the whiteboard from the stage area.
                queue = queue.filter(p => p?.participantId !== constants_2.WHITEBOARD_ID);
            }
            // If queue is undefined we haven't made any changes to the active participants. This will mostly happen
            // if the participant that we are trying to add is not pinned and all slots are currently taken by pinned
            // participants.
            // IMPORTANT: setting active participants to undefined will crash jitsi-meet.
            if (typeof queue !== 'undefined') {
                dispatch((0, actions_web_2.setStageParticipants)(queue));
                if (!pinned) {
                    const timeoutId = setTimeout(() => dispatch((0, actions_web_2.removeStageParticipant)(participantId)), constants_3.ACTIVE_PARTICIPANT_TIMEOUT);
                    timers.set(participantId, timeoutId);
                }
            }
            if ((0, functions_web_1.getCurrentLayout)(state) === constants_1.LAYOUTS.TILE_VIEW) {
                dispatch((0, actions_web_1.setTileView)(false));
            }
            break;
        }
        case actionTypes_4.REMOVE_STAGE_PARTICIPANT: {
            const state = store.getState();
            const { participantId } = action;
            const tid = timers.get(participantId);
            clearTimeout(tid);
            timers.delete(participantId);
            const dominant = (0, functions_1.getDominantSpeakerParticipant)(state);
            if (participantId === dominant?.id) {
                const timeoutId = setTimeout(() => store.dispatch((0, actions_web_2.removeStageParticipant)(participantId)), constants_3.ACTIVE_PARTICIPANT_TIMEOUT);
                timers.set(participantId, timeoutId);
                return;
            }
            break;
        }
        case actionTypes_1.DOMINANT_SPEAKER_CHANGED: {
            const { id } = action.participant;
            const state = store.getState();
            const stageFilmstrip = (0, functions_web_2.isStageFilmstripAvailable)(state);
            const local = (0, functions_1.getLocalParticipant)(state);
            const currentLayout = (0, functions_web_1.getCurrentLayout)(state);
            const dominantSpeaker = (0, functions_1.getDominantSpeakerParticipant)(state);
            if (dominantSpeaker?.id === id || id === local?.id || currentLayout === constants_1.LAYOUTS.TILE_VIEW) {
                break;
            }
            if (stageFilmstrip) {
                const isPinned = (0, functions_web_2.getPinnedActiveParticipants)(state).some(p => p.participantId === id);
                store.dispatch((0, actions_web_2.addStageParticipant)(id, Boolean(isPinned)));
            }
            break;
        }
        case actionTypes_1.PARTICIPANT_LEFT: {
            const state = store.getState();
            const { id } = action.participant;
            const activeParticipantsIds = (0, functions_web_2.getActiveParticipantsIds)(state);
            if (activeParticipantsIds.find(pId => pId === id)) {
                const tid = timers.get(id);
                const { activeParticipants } = state['features/filmstrip'];
                clearTimeout(tid);
                timers.delete(id);
                store.dispatch((0, actions_web_2.setStageParticipants)(activeParticipants.filter(p => p.participantId !== id)));
            }
            break;
        }
        case actionTypes_4.TOGGLE_PIN_STAGE_PARTICIPANT: {
            const { dispatch, getState } = store;
            const state = getState();
            const { participantId } = action;
            const pinnedParticipants = (0, functions_web_2.getPinnedActiveParticipants)(state);
            const dominant = (0, functions_1.getDominantSpeakerParticipant)(state);
            if ((0, functions_web_2.isStageFilmstripTopPanel)(state, 2)) {
                const screenshares = state['features/video-layout'].remoteScreenShares;
                if (screenshares.find(sId => sId === participantId)) {
                    dispatch((0, actions_web_2.setScreenshareFilmstripParticipant)(participantId));
                    break;
                }
            }
            if (pinnedParticipants.find(p => p.participantId === participantId)) {
                if (dominant?.id === participantId) {
                    const { activeParticipants } = state['features/filmstrip'];
                    const queue = activeParticipants.map(p => {
                        if (p.participantId === participantId) {
                            return {
                                participantId,
                                pinned: false
                            };
                        }
                        return p;
                    });
                    dispatch((0, actions_web_2.setStageParticipants)(queue));
                }
                else {
                    dispatch((0, actions_web_2.removeStageParticipant)(participantId));
                }
            }
            else {
                dispatch((0, actions_web_2.addStageParticipant)(participantId, true));
            }
            break;
        }
        case actionTypes_4.CLEAR_STAGE_PARTICIPANTS: {
            const activeParticipants = (0, functions_web_2.getActiveParticipantsIds)(store.getState());
            activeParticipants.forEach(pId => {
                const tid = timers.get(pId);
                clearTimeout(tid);
                timers.delete(pId);
            });
        }
    }
    return result ?? next(action);
});
