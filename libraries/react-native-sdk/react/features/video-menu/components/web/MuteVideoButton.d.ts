/// <reference types="react" />
import { IButtonProps } from '../../types';
/**
 * Implements a React {@link Component} which displays a button for disabling
 * the camera of a participant in the conference.
 *
 * @returns {JSX.Element|null}
 */
declare const MuteVideoButton: ({ notifyClick, notifyMode, participantID }: IButtonProps) => JSX.Element | null;
export default MuteVideoButton;
