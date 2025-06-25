import { IReduxState } from '../app/types';
import { IStateful } from '../base/app/types';
/**
 * Returns true if user is allowed to change Server URL.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {boolean} True to indicate that user can change Server URL, false otherwise.
 */
export declare function isServerURLChangeEnabled(stateful: IStateful): any;
/**
 * Normalizes a URL entered by the user.
 * FIXME: Consider adding this to base/util/uri.
 *
 * @param {string} url - The URL to validate.
 * @returns {string|null} - The normalized URL, or null if the URL is invalid.
 */
export declare function normalizeUserInputURL(url: string): string | null;
/**
 * Returns the notification types and their user selected configuration.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {Object} - The section of notifications to be configured.
 */
export declare function getNotificationsMap(stateful: IStateful): {
    [key: string]: boolean;
};
/**
 * Returns the properties for the "More" tab from settings dialog from Redux
 * state.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {Object} - The properties for the "More" tab from settings dialog.
 */
export declare function getMoreTabProps(stateful: IStateful): {
    currentLanguage: string;
    disableHideSelfView: boolean | undefined;
    hideSelfView: boolean;
    iAmVisitor: boolean;
    languages: string[];
    maxStageParticipants: number | undefined;
    showLanguageSettings: boolean;
    showPrejoinPage: boolean;
    showPrejoinSettings: boolean;
    stageFilmstripEnabled: boolean;
};
/**
 * Returns the properties for the "More" tab from settings dialog from Redux
 * state.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {Object} - The properties for the "More" tab from settings dialog.
 */
export declare function getModeratorTabProps(stateful: IStateful): {
    showModeratorSettings: boolean;
    disableReactionsModeration: boolean;
    followMeActive: boolean;
    followMeEnabled: boolean;
    startReactionsMuted: boolean;
    startAudioMuted: boolean;
    startVideoMuted: boolean;
};
/**
 * Returns the properties for the "Profile" tab from settings dialog from Redux
 * state.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {Object} - The properties for the "Profile" tab from settings
 * dialog.
 */
export declare function getProfileTabProps(stateful: IStateful): {
    authEnabled: boolean;
    authLogin: string | undefined;
    displayName: string | undefined;
    email: string | undefined;
    hideEmailInSettings: boolean | undefined;
    id: string | undefined;
    readOnlyName: boolean;
};
/**
 * Returns the properties for the "Sounds" tab from settings dialog from Redux
 * state.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {boolean} showSoundsSettings - Whether to show the sound settings or not.
 * @returns {Object} - The properties for the "Sounds" tab from settings
 * dialog.
 */
export declare function getNotificationsTabProps(stateful: IStateful, showSoundsSettings?: boolean): {
    disabledSounds: import("../base/config/configType").Sounds[];
    enabledNotifications: {
        [key: string]: boolean;
    };
    showNotificationsSettings: boolean;
    soundsIncomingMessage: boolean | undefined;
    soundsParticipantJoined: boolean | undefined;
    soundsParticipantKnocking: boolean | undefined;
    soundsParticipantLeft: boolean | undefined;
    soundsTalkWhileMuted: boolean | undefined;
    soundsReactions: boolean | undefined;
    enableReactions: boolean;
    moderatorMutedSoundsReactions: boolean;
    showSoundsSettings: boolean | undefined;
};
/**
 * Returns the visibility state of the audio settings.
 *
 * @param {Object} state - The state of the application.
 * @returns {boolean}
 */
export declare function getAudioSettingsVisibility(state: IReduxState): boolean | undefined;
/**
 * Returns the visibility state of the video settings.
 *
 * @param {Object} state - The state of the application.
 * @returns {boolean}
 */
export declare function getVideoSettingsVisibility(state: IReduxState): boolean | undefined;
