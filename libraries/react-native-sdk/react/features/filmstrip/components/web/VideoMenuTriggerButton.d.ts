/// <reference types="react" />
export interface IProps {
    /**
     * Hide popover callback.
     */
    hidePopover?: Function;
    /**
     * Whether or not the button is for the local participant.
     */
    local?: boolean;
    /**
     * The id of the participant for which the button is.
     */
    participantId?: string;
    /**
     * Whether popover is visible or not.
     */
    popoverVisible?: boolean;
    /**
     * Show popover callback.
     */
    showPopover?: Function;
    /**
     * The type of thumbnail.
     */
    thumbnailType: string;
    /**
     * Whether or not the component is visible.
     */
    visible: boolean;
}
declare const VideoMenuTriggerButton: ({ hidePopover, local, participantId, popoverVisible, showPopover, thumbnailType, visible }: IProps) => JSX.Element;
export default VideoMenuTriggerButton;
