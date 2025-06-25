/// <reference types="react" />
export interface IProps {
    /**
     * Whether to hide the connection indicator.
     */
    disableConnectionIndicator?: boolean;
    /**
     * Hide popover callback.
     */
    hidePopover?: Function;
    /**
     * Class name for the status indicators container.
     */
    indicatorsClassName?: string;
    /**
     * Whether or not the thumbnail is hovered.
     */
    isHovered: boolean;
    /**
     * Whether or not the indicators are for the local participant.
     */
    local?: boolean;
    /**
     * Id of the participant for which the component is displayed.
     */
    participantId: string;
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
}
declare const ThumbnailTopIndicators: ({ disableConnectionIndicator, hidePopover, indicatorsClassName, isHovered, local, participantId, popoverVisible, showPopover, thumbnailType }: IProps) => JSX.Element;
export default ThumbnailTopIndicators;
