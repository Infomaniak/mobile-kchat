/// <reference types="react" />
import { IButtonProps } from '../../types';
export interface IProps extends IButtonProps {
    /**
     * Button text class name.
     */
    className?: string;
    /**
     * Whether the icon should be hidden or not.
     */
    noIcon?: boolean;
    /**
     * Click handler executed aside from the main action.
     */
    onClick?: Function;
}
/**
 * Implements a React {@link Component} which displays a button for demoting a participant to visitor.
 *
 * @returns {JSX.Element}
 */
export default function DemoteToVisitorButton({ className, noIcon, notifyClick, notifyMode, participantID }: IProps): JSX.Element;
