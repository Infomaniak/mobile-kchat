/// <reference types="react" />
import { IButtonProps } from '../../types';
/**
 * Implements a React {@link Component} which displays a button for audio muting
 * every participant in the conference except the one with the given
 * participantID.
 *
 * @returns {JSX.Element}
 */
declare const MuteEveryoneElsesVideoButton: ({ notifyClick, notifyMode, participantID }: IButtonProps) => JSX.Element;
export default MuteEveryoneElsesVideoButton;
