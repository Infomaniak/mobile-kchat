/// <reference types="react" />
import { MediaType } from '../../../base/media/constants';
import { IButtonProps } from '../../types';
export interface IProps extends IButtonProps {
    buttonType: MediaType;
}
/**
 * Implements a React {@link Component} which displays a button that
 * allows the moderator to request from a participant to mute themselves.
 *
 * @returns {JSX.Element}
 */
declare const AskToUnmuteButton: ({ buttonType, notifyMode, notifyClick, participantID }: IProps) => JSX.Element;
export default AskToUnmuteButton;
