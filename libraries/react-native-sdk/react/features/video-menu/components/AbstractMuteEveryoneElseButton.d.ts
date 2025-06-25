import AbstractButton, { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * The ID of the participant object that this button is supposed to keep unmuted.
     */
    participantID: string;
}
/**
 * An abstract remote video menu button which mutes all the other participants.
 */
export default class AbstractMuteEveryoneElseButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    icon: any;
    label: string;
    /**
     * Handles clicking / pressing the button, and opens a confirmation dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick(): void;
}
