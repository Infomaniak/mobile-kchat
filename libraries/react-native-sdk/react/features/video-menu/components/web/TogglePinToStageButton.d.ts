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
declare const TogglePinToStageButton: ({ className, noIcon, notifyClick, notifyMode, onClick, participantID }: IProps) => JSX.Element;
export default TogglePinToStageButton;
