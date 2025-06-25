import { IParticipant } from '../base/participants/types';
export * from './actions.any';
/**
 * Displays the chat panel.
 *
 * @param {Object} participant - The recipient for the private chat.
 * @param {boolean} disablePolls - Checks if polls are disabled.
 *
 * @returns {{
 *     participant: participant,
 *     type: OPEN_CHAT
 * }}
 */
export declare function openChat(participant: IParticipant | undefined | Object, disablePolls?: boolean): {
    participant: Object | IParticipant | undefined;
    type: string;
};
