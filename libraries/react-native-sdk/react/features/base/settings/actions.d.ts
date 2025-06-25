import { ISettingsState } from './reducer';
/**
 * Create an action for when the settings are updated.
 *
 * @param {Object} settings - The new (partial) settings properties.
 * @returns {{
 *     type: SETTINGS_UPDATED,
 *     settings: {
 *         audioOutputDeviceId: string,
 *         avatarURL: string,
 *         cameraDeviceId: string,
 *         displayName: string,
 *         email: string,
 *         localFlipX: boolean,
 *         micDeviceId: string,
 *         serverURL: string,
 *         soundsReactions: boolean,
 *         startAudioOnly: boolean,
 *         startWithAudioMuted: boolean,
 *         startWithVideoMuted: boolean,
 *         startWithReactionsMuted: boolean
 *     }
 * }}
 */
export declare function updateSettings(settings: Partial<ISettingsState>): {
    type: string;
    settings: Partial<ISettingsState>;
};
