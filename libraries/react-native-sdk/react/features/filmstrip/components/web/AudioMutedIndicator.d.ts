/// <reference types="react" />
import { TOOLTIP_POSITION } from '../../../base/ui/constants.any';
/**
 * The type of the React {@code Component} props of {@link AudioMutedIndicator}.
 */
export interface IProps {
    /**
     * From which side of the indicator the tooltip should appear from.
     */
    tooltipPosition: TOOLTIP_POSITION;
}
/**
 * React {@code Component} for showing an audio muted icon with a tooltip.
 *
 * @returns {Component}
 */
declare const AudioMutedIndicator: ({ tooltipPosition }: IProps) => JSX.Element;
export default AudioMutedIndicator;
