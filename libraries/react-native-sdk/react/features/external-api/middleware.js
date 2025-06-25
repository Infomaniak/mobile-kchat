"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error
const transport_1 = require("../../../modules/transport");
const actionTypes_1 = require("../base/conference/actionTypes");
const actionTypes_2 = require("../base/config/actionTypes");
const actionTypes_3 = require("../base/devices/actionTypes");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const actionTypes_4 = require("../base/participants/actionTypes");
const functions_1 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const helpers_1 = require("../base/util/helpers");
const functions_2 = require("../display-name/functions");
const actionTypes_5 = require("../feedback/actionTypes");
const actionTypes_6 = require("../filmstrip/actionTypes");
require("./subscriber");
/**
 * The middleware of the feature {@code external-api}.
 *
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    // We need to do these before executing the rest of the middelware chain
    switch (action.type) {
        case actionTypes_4.DOMINANT_SPEAKER_CHANGED: {
            const dominantSpeaker = (0, functions_1.getDominantSpeakerParticipant)(store.getState());
            if (dominantSpeaker?.id !== action.participant.id) {
                const result = next(action);
                APP.API.notifyDominantSpeakerChanged(action.participant.id);
                return result;
            }
            break;
        }
        case actionTypes_4.SET_LOADABLE_AVATAR_URL: {
            const { id, loadableAvatarUrl } = action.participant;
            const participant = (0, functions_1.getParticipantById)(store.getState(), id);
            const result = next(action);
            if (participant) {
                if (loadableAvatarUrl) {
                    participant.loadableAvatarUrl !== loadableAvatarUrl && APP.API.notifyAvatarChanged(id, loadableAvatarUrl);
                }
                else {
                    // There is no loadable explicit URL. In this case the Avatar component would
                    // decide to render initials or the default avatar, but the external API needs
                    // a URL when it needs to be rendered, so if there is no initials, we return the default
                    // Avatar URL as if it was a usual avatar URL. If there are (or may be) initials
                    // we send undefined to signal the api user that it's not an URL that needs to be rendered.
                    //
                    // NOTE: we may implement a special URL format later to signal that the avatar is based
                    // on initials, that API consumers can handle as they want, e.g. initials://jm
                    APP.API.notifyAvatarChanged(id, participant.name ? undefined : _getDefaultAvatarUrl());
                }
            }
            return result;
        }
    }
    const result = next(action);
    // These should happen after the rest of the middleware chain ran
    switch (action.type) {
        case actionTypes_1.CONFERENCE_FAILED: {
            if (action.conference
                && action.error.name === lib_jitsi_meet_1.JitsiConferenceErrors.PASSWORD_REQUIRED) {
                APP.API.notifyOnPasswordRequired();
            }
            break;
        }
        case actionTypes_1.CONFERENCE_JOINED: {
            const state = store.getState();
            const { defaultLocalDisplayName } = state['features/base/config'];
            const { room } = state['features/base/conference'];
            const { loadableAvatarUrl, name, id, email } = (0, functions_1.getLocalParticipant)(state) ?? {};
            const breakoutRoom = APP.conference.roomName.toString() !== room?.toLowerCase();
            // we use APP.conference.roomName as we do not update state['features/base/conference'].room when
            // moving between rooms in case of breakout rooms and it stays always with the name of the main room
            APP.API.notifyConferenceJoined(APP.conference.roomName, id, {
                displayName: name,
                formattedDisplayName: (0, functions_2.appendSuffix)(name ?? '', defaultLocalDisplayName),
                avatarURL: loadableAvatarUrl,
                breakoutRoom,
                email
            });
            break;
        }
        case actionTypes_1.DATA_CHANNEL_CLOSED:
            APP.API.notifyDataChannelClosed(action.code, action.reason);
            break;
        case actionTypes_1.DATA_CHANNEL_OPENED:
            APP.API.notifyDataChannelOpened();
            break;
        case actionTypes_1.KICKED_OUT:
            APP.API.notifyKickedOut({
                id: (0, functions_1.getLocalParticipant)(store.getState())?.id,
                local: true
            }, { id: action.participant ? action.participant.getId() : undefined });
            break;
        case actionTypes_3.NOTIFY_CAMERA_ERROR:
            if (action.error) {
                APP.API.notifyOnCameraError(action.error.name, action.error.message);
            }
            break;
        case actionTypes_3.NOTIFY_MIC_ERROR:
            if (action.error) {
                APP.API.notifyOnMicError(action.error.name, action.error.message);
            }
            break;
        case actionTypes_4.PARTICIPANT_KICKED:
            APP.API.notifyKickedOut({
                id: action.kicked,
                local: false
            }, { id: action.kicker });
            break;
        case actionTypes_4.PARTICIPANT_LEFT: {
            const { participant } = action;
            const { fakeParticipant } = participant;
            // Skip sending participant left event for fake participants.
            if (fakeParticipant) {
                break;
            }
            APP.API.notifyUserLeft(action.participant.id);
            break;
        }
        case actionTypes_4.PARTICIPANT_JOINED: {
            const state = store.getState();
            const { defaultRemoteDisplayName } = state['features/base/config'];
            const { participant } = action;
            const { fakeParticipant, id, local, name } = participant;
            // The version of external api outside of middleware did not emit
            // the local participant being created.
            if (!local) {
                // Skip sending participant joined event for fake participants.
                if (fakeParticipant) {
                    break;
                }
                APP.API.notifyUserJoined(id, {
                    displayName: name,
                    formattedDisplayName: (0, functions_2.appendSuffix)(name || defaultRemoteDisplayName)
                });
            }
            break;
        }
        case actionTypes_4.PARTICIPANT_ROLE_CHANGED:
            APP.API.notifyUserRoleChanged(action.participant.id, action.participant.role);
            break;
        case actionTypes_2.SET_CONFIG: {
            const state = store.getState();
            const { disableBeforeUnloadHandlers = false } = state['features/base/config'];
            /**
             * Disposing the API when the user closes the page.
             */
            window.addEventListener(disableBeforeUnloadHandlers ? 'unload' : 'beforeunload', () => {
                APP.API.notifyConferenceLeft(APP.conference.roomName);
                APP.API.dispose();
                (0, transport_1.getJitsiMeetTransport)().dispose();
            });
            break;
        }
        case actionTypes_6.SET_FILMSTRIP_VISIBLE:
            APP.API.notifyFilmstripDisplayChanged(action.visible);
            break;
        case actionTypes_5.SUBMIT_FEEDBACK_ERROR:
            APP.API.notifyFeedbackSubmitted(action.error || 'Unknown error');
            break;
        case actionTypes_5.SUBMIT_FEEDBACK_SUCCESS:
            APP.API.notifyFeedbackSubmitted();
            break;
    }
    return result;
});
/**
 * Returns the absolute URL of the default avatar.
 *
 * @returns {string}
 */
function _getDefaultAvatarUrl() {
    return new URL('images/avatar.png', (0, helpers_1.getBaseUrl)()).href;
}
