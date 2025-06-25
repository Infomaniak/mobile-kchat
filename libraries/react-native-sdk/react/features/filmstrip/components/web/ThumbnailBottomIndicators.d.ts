/// <reference types="react" />
export interface IProps {
    /**
     * Class name for indicators container.
     */
    className?: string;
    /**
     * Whether or not the indicators are for the local participant.
     */
    local: boolean;
    /**
     * Id of the participant for which the component is displayed.
     */
    participantId: string;
    /**
     * Whether or not to show the status indicators.
     */
    showStatusIndicators?: boolean;
    /**
     * The type of thumbnail.
     */
    thumbnailType?: string;
}
declare const ThumbnailBottomIndicators: ({ className, local, participantId, showStatusIndicators, thumbnailType }: IProps) => JSX.Element;
export default ThumbnailBottomIndicators;
