"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actionTypes_1 = require("../base/conference/actionTypes");
const functions_1 = require("../base/conference/functions");
const constants_1 = require("../base/media/constants");
const actionTypes_2 = require("../base/participants/actionTypes");
const actions_1 = require("../base/participants/actions");
const functions_2 = require("../base/participants/functions");
const types_1 = require("../base/participants/types");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_3 = require("./actionTypes");
const actions_any_1 = require("./actions.any");
const constants_2 = require("./constants");
const functions_3 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Middleware that captures actions related to video sharing and updates
 * components not hooked into redux.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    const { dispatch, getState } = store;
    const state = getState();
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOIN_IN_PROGRESS: {
            const { conference } = action;
            const localParticipantId = (0, functions_2.getLocalParticipant)(state)?.id;
            conference.addCommandListener(constants_2.SHARED_VIDEO, ({ value, attributes }) => {
                const { from } = attributes;
                const sharedVideoStatus = attributes.state;
                if ((0, functions_3.isSharingStatus)(sharedVideoStatus)) {
                    handleSharingVideoStatus(store, value, attributes, conference);
                }
                else if (sharedVideoStatus === 'stop') {
                    const videoParticipant = (0, functions_2.getParticipantById)(state, value);
                    dispatch((0, actions_1.participantLeft)(value, conference, {
                        fakeParticipant: videoParticipant?.fakeParticipant
                    }));
                    if (localParticipantId !== from) {
                        dispatch((0, actions_any_1.resetSharedVideoStatus)());
                    }
                }
            });
            break;
        }
        case actionTypes_1.CONFERENCE_LEFT:
            dispatch((0, actions_any_1.resetSharedVideoStatus)());
            break;
        case actionTypes_2.PARTICIPANT_LEFT: {
            const conference = (0, functions_1.getCurrentConference)(state);
            const { ownerId: stateOwnerId, videoUrl: statevideoUrl } = state['features/shared-video'];
            if (action.participant.id === stateOwnerId) {
                (0, react_redux_1.batch)(() => {
                    dispatch((0, actions_any_1.resetSharedVideoStatus)());
                    dispatch((0, actions_1.participantLeft)(statevideoUrl ?? '', conference));
                });
            }
            break;
        }
        case actionTypes_3.SET_SHARED_VIDEO_STATUS: {
            const conference = (0, functions_1.getCurrentConference)(state);
            const localParticipantId = (0, functions_2.getLocalParticipant)(state)?.id;
            const { videoUrl, status, ownerId, time, muted, volume } = action;
            const operator = status === constants_2.PLAYBACK_STATUSES.PLAYING ? 'is' : '';
            logger_1.default.debug(`User with id: ${ownerId} ${operator} ${status} video sharing.`);
            if (typeof APP !== 'undefined') {
                APP.API.notifyAudioOrVideoSharingToggled(constants_1.MEDIA_TYPE.VIDEO, status, ownerId);
            }
            if (localParticipantId === ownerId) {
                sendShareVideoCommand({
                    conference,
                    localParticipantId,
                    muted,
                    status,
                    time,
                    id: videoUrl,
                    volume
                });
            }
            break;
        }
        case actionTypes_3.RESET_SHARED_VIDEO_STATUS: {
            const localParticipantId = (0, functions_2.getLocalParticipant)(state)?.id;
            const { ownerId: stateOwnerId, videoUrl: statevideoUrl } = state['features/shared-video'];
            if (!stateOwnerId) {
                break;
            }
            logger_1.default.debug(`User with id: ${stateOwnerId} stop video sharing.`);
            if (typeof APP !== 'undefined') {
                APP.API.notifyAudioOrVideoSharingToggled(constants_1.MEDIA_TYPE.VIDEO, 'stop', stateOwnerId);
            }
            if (localParticipantId === stateOwnerId) {
                const conference = (0, functions_1.getCurrentConference)(state);
                sendShareVideoCommand({
                    conference,
                    id: statevideoUrl ?? '',
                    localParticipantId,
                    muted: true,
                    status: 'stop',
                    time: 0,
                    volume: 0
                });
            }
            break;
        }
    }
    return next(action);
});
/**
 * Handles the playing, pause and start statuses for the shared video.
 * Dispatches participantJoined event and, if necessary, pins it.
 * Sets the SharedVideoStatus if the event was triggered by the local user.
 *
 * @param {Store} store - The redux store.
 * @param {string} videoUrl - The id of the video to the shared.
 * @param {Object} attributes - The attributes received from the share video command.
 * @param {JitsiConference} conference - The current conference.
 * @returns {void}
 */
function handleSharingVideoStatus(store, videoUrl, { state, time, from, muted }, conference) {
    const { dispatch, getState } = store;
    const localParticipantId = (0, functions_2.getLocalParticipant)(getState())?.id;
    const oldStatus = getState()['features/shared-video']?.status ?? '';
    if (state === 'start' || !['playing', 'pause', 'start'].includes(oldStatus)) {
        const youtubeId = videoUrl.match(/http/) ? false : videoUrl;
        const avatarURL = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/0.jpg` : '';
        dispatch((0, actions_1.participantJoined)({
            conference,
            fakeParticipant: types_1.FakeParticipant.SharedVideo,
            id: videoUrl,
            avatarURL,
            name: constants_2.VIDEO_PLAYER_PARTICIPANT_NAME
        }));
        dispatch((0, actions_1.pinParticipant)(videoUrl));
    }
    if (localParticipantId !== from) {
        dispatch((0, actions_any_1.setSharedVideoStatus)({
            muted: muted === 'true',
            ownerId: from,
            status: state,
            time: Number(time),
            videoUrl
        }));
    }
}
/* eslint-disable max-params */
/**
 * Sends SHARED_VIDEO command.
 *
 * @param {string} id - The id of the video.
 * @param {string} status - The status of the shared video.
 * @param {JitsiConference} conference - The current conference.
 * @param {string} localParticipantId - The id of the local participant.
 * @param {string} time - The seek position of the video.
 * @returns {void}
 */
function sendShareVideoCommand({ id, status, conference, localParticipantId = '', time, muted, volume }) {
    conference?.sendCommandOnce(constants_2.SHARED_VIDEO, {
        value: id,
        attributes: {
            from: localParticipantId,
            muted,
            state: status,
            time,
            volume
        }
    });
}
