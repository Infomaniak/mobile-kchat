/// <reference types="react" />
import { TOOLTIP_POSITION } from '../../../base/ui/constants.any';
/**
 * The type of the React {@code Component} props of {@link ModeratorIndicator}.
 */
export interface IProps {
    /**
     * From which side of the indicator the tooltip should appear from.
     */
    tooltipPosition: TOOLTIP_POSITION;
}
/**
 * React {@code Component} for showing a moderator icon with a tooltip.
 *
 * @returns {JSX.Element}
 */
declare const ModeratorIndicator: ({ tooltipPosition }: IProps) => JSX.Element;
export default ModeratorIndicator;
