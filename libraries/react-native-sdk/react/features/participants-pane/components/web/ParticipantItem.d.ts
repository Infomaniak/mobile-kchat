import React, { ReactNode } from 'react';
import { WithTranslation } from 'react-i18next';
import { type ActionTrigger, MediaState } from '../../constants';
export interface IProps extends WithTranslation {
    /**
     * Type of trigger for the participant actions.
     */
    actionsTrigger?: ActionTrigger;
    /**
     * Media state for audio.
     */
    audioMediaState?: MediaState;
    /**
     * React children.
     */
    children?: ReactNode;
    /**
     * Whether or not to disable the moderator indicator.
     */
    disableModeratorIndicator?: boolean;
    /**
     * The name of the participant. Used for showing lobby names.
     */
    displayName?: string;
    /**
     * Is this item highlighted/raised.
     */
    isHighlighted?: boolean;
    /**
     * Whether or not the participant is a moderator.
     */
    isModerator?: boolean;
    /**
     * True if the participant is local.
     */
    local?: boolean;
    /**
     * Callback for when the mouse leaves this component.
     */
    onLeave?: (e?: React.MouseEvent) => void;
    /**
     * Opens a drawer with participant actions.
     */
    openDrawerForParticipant?: Function;
    /**
     * If an overflow drawer can be opened.
     */
    overflowDrawer?: boolean;
    /**
     * The ID of the participant.
     */
    participantID: string;
    /**
     * True if the participant have raised hand.
     */
    raisedHand?: boolean;
    /**
     * Media state for video.
     */
    videoMediaState?: MediaState;
    /**
     * The translated "you" text.
     */
    youText?: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
