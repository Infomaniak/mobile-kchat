/// <reference types="react" />
import { IButtonProps } from '../../types';
/**
 * Implements a React {@link Component} which displays a button for granting
 * moderator to a participant.
 *
 * @returns {JSX.Element|null}
 */
declare const GrantModeratorButton: ({ notifyClick, notifyMode, participantID }: IButtonProps) => JSX.Element | null;
export default GrantModeratorButton;
