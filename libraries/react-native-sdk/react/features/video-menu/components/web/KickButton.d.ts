/// <reference types="react" />
import { IButtonProps } from '../../types';
/**
 * Implements a React {@link Component} which displays a button for kicking out
 * a participant from the conference.
 *
 * @returns {JSX.Element}
 */
declare const KickButton: ({ notifyClick, notifyMode, participantID }: IButtonProps) => JSX.Element;
export default KickButton;
