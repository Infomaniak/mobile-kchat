/// <reference types="react" />
import { TOOLTIP_POSITION } from '../../../base/ui/constants.any';
export interface IProps {
    /**
     * From which side of the indicator the tooltip should appear from.
     */
    tooltipPosition: TOOLTIP_POSITION;
}
/**
 * React {@code Component} for showing a screen-sharing icon with a tooltip.
 *
 * @param {IProps} props - React props passed to this component.
 * @returns {React$Element<any>}
 */
export default function ScreenShareIndicator(props: IProps): JSX.Element;
