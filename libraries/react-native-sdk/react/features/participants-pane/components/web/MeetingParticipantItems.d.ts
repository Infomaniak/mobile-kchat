import React from 'react';
export interface IProps {
    /**
     * The translated ask unmute text for the quick action buttons.
     */
    askUnmuteText?: string;
    /**
     * Whether or not the local participant is in a breakout room.
     */
    isInBreakoutRoom: boolean;
    /**
     * Callback for the mouse leaving this item.
     */
    lowerMenu: Function;
    /**
     * Callback used to open a confirmation dialog for audio muting.
     */
    muteAudio: Function;
    /**
     * The translated text for the mute participant button.
     */
    muteParticipantButtonText?: string;
    /**
     * Callback used to open an actions drawer for a participant.
     */
    openDrawerForParticipant: Function;
    /**
     * True if an overflow drawer should be displayed.
     */
    overflowDrawer?: boolean;
    /**
     * The aria-label for the ellipsis action.
     */
    participantActionEllipsisLabel: string;
    /**
     * The meeting participants.
     */
    participantIds: Array<string>;
    /**
     * The if of the participant for which the context menu should be open.
     */
    raiseContextId?: string;
    /**
     * Current search string.
     */
    searchString?: string;
    /**
     * Callback used to stop a participant's video.
     */
    stopVideo: Function;
    /**
     * Callback for the activation of this item's context menu.
     */
    toggleMenu: Function;
    /**
     * The translated "you" text.
     */
    youText: string;
}
declare const _default: React.NamedExoticComponent<IProps>;
export default _default;
