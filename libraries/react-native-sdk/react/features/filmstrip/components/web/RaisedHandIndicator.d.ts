/// <reference types="react" />
import { TOOLTIP_POSITION } from '../../../base/ui/constants.any';
/**
 * The type of the React {@code Component} props of {@link RaisedHandIndicator}.
 */
export interface IProps {
    /**
     * The font-size for the icon.
     */
    iconSize: number;
    /**
     * The participant id who we want to render the raised hand indicator
     * for.
     */
    participantId: string;
    /**
     * From which side of the indicator the tooltip should appear from.
     */
    tooltipPosition: TOOLTIP_POSITION;
}
/**
 * Thumbnail badge showing that the participant would like to speak.
 *
 * @returns {ReactElement}
 */
declare const RaisedHandIndicator: ({ iconSize, participantId, tooltipPosition }: IProps) => JSX.Element | null;
export default RaisedHandIndicator;
