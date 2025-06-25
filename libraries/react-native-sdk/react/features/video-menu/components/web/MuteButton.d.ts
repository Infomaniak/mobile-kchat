/// <reference types="react" />
import { IButtonProps } from '../../types';
/**
 * Implements a React {@link Component} which displays a button for audio muting
 * a participant in the conference.
 *
 * @returns {JSX.Element|null}
 */
declare const MuteButton: ({ notifyClick, notifyMode, participantID }: IButtonProps) => JSX.Element | null;
export default MuteButton;
