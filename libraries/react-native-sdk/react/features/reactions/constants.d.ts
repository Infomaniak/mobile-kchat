/**
 * The height of the raise hand row in the reactions menu.
 */
export declare const RAISE_HAND_ROW_HEIGHT = 54;
/**
 * The height of the gifs menu when displayed as part of the overflow menu.
 */
export declare const GIFS_MENU_HEIGHT_IN_OVERFLOW_MENU = 200;
/**
 * Reactions menu height when displayed as part of drawer.
 */
export declare const REACTIONS_MENU_HEIGHT_DRAWER = 144;
/**
 * Reactions menu height when displayed as part of overflow menu.
 */
export declare const REACTIONS_MENU_HEIGHT_IN_OVERFLOW_MENU = 106;
/**
 * The payload name for the datachannel/endpoint reaction event.
 */
export declare const ENDPOINT_REACTION_NAME = "endpoint-reaction";
/**
 * The (name of the) command which transports the state (represented by
 * {State} for the local state at the time of this writing) of a {MuteReactions}
 * (instance) between moderator and participants.
 */
export declare const MUTE_REACTIONS_COMMAND = "mute-reactions";
/**
 * The prefix for all reaction sound IDs. Also the ID used in config to disable reaction sounds.
 */
export declare const REACTION_SOUND = "REACTION_SOUND";
/**
 * The audio ID prefix of the audio element for which the {@link playAudio} action is
 * triggered when a new laugh reaction is received.
 *
 * @type { string }
 */
export declare const LAUGH_SOUND_ID: string;
/**
 * The audio ID prefix of the audio element for which the {@link playAudio} action is
 * triggered when a new clap reaction is received.
 *
 * @type {string}
 */
export declare const CLAP_SOUND_ID: string;
/**
 * The audio ID prefix of the audio element for which the {@link playAudio} action is
 * triggered when a new like reaction is received.
 *
 * @type {string}
 */
export declare const LIKE_SOUND_ID: string;
/**
 * The audio ID prefix of the audio element for which the {@link playAudio} action is
 * triggered when a new boo reaction is received.
 *
 * @type {string}
 */
export declare const BOO_SOUND_ID: string;
/**
 * The audio ID prefix of the audio element for which the {@link playAudio} action is
 * triggered when a new surprised reaction is received.
 *
 * @type {string}
 */
export declare const SURPRISE_SOUND_ID: string;
/**
 * The audio ID prefix of the audio element for which the {@link playAudio} action is
 * triggered when a new silence reaction is received.
 *
 * @type {string}
 */
export declare const SILENCE_SOUND_ID: string;
/**
 * The audio ID of the audio element for which the {@link playAudio} action is
 * triggered when a new raise hand event is received.
 *
 * @type {string}
 */
export declare const RAISE_HAND_SOUND_ID = "RAISE_HAND_SOUND";
export interface IReactionEmojiProps {
    /**
     * Reaction to be displayed.
     */
    reaction: string;
    /**
     * Id of the reaction.
     */
    uid: string;
}
export declare const SOUNDS_THRESHOLDS: number[];
interface IReactions {
    [key: string]: {
        emoji: string;
        message: string;
        shortcutChar: string;
        soundFiles: string[];
        soundId: string;
    };
}
export declare const REACTIONS: IReactions;
export type ReactionThreshold = {
    reaction: string;
    threshold: number;
};
export interface IMuteCommandAttributes {
    startReactionsMuted?: string;
}
export {};
