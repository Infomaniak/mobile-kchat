import AbstractButton, { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
/**
 * Implementation of a button for opening speaker stats dialog.
 */
declare class AbstractSpeakerStatsButton extends AbstractButton<AbstractButtonProps> {
    accessibilityLabel: string;
    icon: any;
    label: string;
    tooltip: string;
}
export default AbstractSpeakerStatsButton;
