import { IReduxState } from '../app/types';
import { IStateful } from '../base/app/types';
import { type MediaType } from '../base/media/constants';
import { IParticipant } from '../base/participants/types';
/**
 * Checks if a participant is force muted.
 *
 * @param {IParticipant|undefined} participant - The participant.
 * @param {MediaType} mediaType - The media type.
 * @param {IReduxState} state - The redux state.
 * @returns {MediaState}
 */
export declare function isForceMuted(participant: IParticipant | undefined, mediaType: MediaType, state: IReduxState): boolean;
/**
 * Determines the audio media state (the mic icon) for a participant.
 *
 * @param {IParticipant} participant - The participant.
 * @param {boolean} muted - The mute state of the participant.
 * @param {IReduxState} state - The redux state.
 * @returns {MediaState}
 */
export declare function getParticipantAudioMediaState(participant: IParticipant | undefined, muted: Boolean, state: IReduxState): import("./constants").MediaState;
/**
 * Determines the video media state (the mic icon) for a participant.
 *
 * @param {IParticipant} participant - The participant.
 * @param {boolean} muted - The mute state of the participant.
 * @param {IReduxState} state - The redux state.
 * @returns {MediaState}
 */
export declare function getParticipantVideoMediaState(participant: IParticipant | undefined, muted: Boolean, state: IReduxState): import("./constants").MediaState;
/**
 * Returns the participants pane config.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {Object}
 */
export declare const getParticipantsPaneConfig: (stateful: IStateful) => {
    enabled?: boolean | undefined;
    hideModeratorSettingsTab?: boolean | undefined;
    hideMoreActionsButton?: boolean | undefined;
    hideMuteAllButton?: boolean | undefined;
};
/**
 * Is the participants pane open.
 *
 * @param {IReduxState} state - Global state.
 * @returns {boolean} Is the participants pane open.
 */
export declare const getParticipantsPaneOpen: (state: IReduxState) => boolean;
/**
 * Returns the type of quick action button to be displayed for a participant.
 * The button is displayed when hovering a participant from the participant list.
 *
 * @param {IParticipant} participant - The participant.
 * @param {boolean} isAudioMuted - If audio is muted for the participant.
 * @param {boolean} isVideoMuted - If audio is muted for the participant.
 * @param {IReduxState} state - The redux state.
 * @returns {string} - The type of the quick action button.
 */
export declare function getQuickActionButtonType(participant: IParticipant | undefined, isAudioMuted: Boolean, isVideoMuted: Boolean, state: IReduxState): import("./constants").QuickActionButtonType;
/**
 * Returns true if the invite button should be rendered.
 *
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
export declare const shouldRenderInviteButton: (state: IReduxState) => any;
/**
 * Selector for retrieving ids of participants in the order that they are displayed in the filmstrip (with the
 * exception of participants with raised hand). The participants are reordered as follows.
 * 1. Dominant speaker.
 * 2. Local participant.
 * 3. Participants with raised hand.
 * 4. Participants with screenshare sorted alphabetically by their display name.
 * 5. Shared video participants.
 * 6. Recent speakers sorted alphabetically by their display name.
 * 7. Rest of the participants sorted alphabetically by their display name.
 *
 * @param {IStateful} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state features/base/participants.
 * @returns {Array<string>}
 */
export declare function getSortedParticipantIds(stateful: IStateful): (string | undefined)[];
/**
 * Checks if a participant matches the search string.
 *
 * @param {Object} participant - The participant to be checked.
 * @param {string} searchString - The participants search string.
 * @returns {boolean}
 */
export declare function participantMatchesSearch(participant: IParticipant | undefined | {
    displayName?: string;
    name?: string;
}, searchString: string): boolean;
/**
 * Returns whether the more actions button is visible.
 *
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
export declare const isMoreActionsVisible: (state: IReduxState) => boolean;
/**
 * Returns whether the mute all button is visible.
 *
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
export declare const isMuteAllVisible: (state: IReduxState) => boolean;
/**
 * Returns true if renaming the currently joined breakout room is allowed and false otherwise.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if reanming the currently joined breakout room is allowed and false otherwise.
 */
export declare function isCurrentRoomRenamable(state: IReduxState): any;
/**
 * Returns true if renaming a breakout room is allowed and false otherwise.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if renaming a breakout room is allowed and false otherwise.
 */
export declare function isBreakoutRoomRenameAllowed(state: IReduxState): any;
/**
 * Returns true if participants is enabled and false otherwise.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {boolean}
 */
export declare const isParticipantsPaneEnabled: (stateful: IStateful) => boolean;
