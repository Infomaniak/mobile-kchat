/// <reference types="react" />
import { ISwitchProps } from '../types';
export interface IProps extends ISwitchProps {
    className?: string;
    /**
     * Id of the toggle.
     */
    id?: string;
}
declare const Switch: ({ className, id, checked, disabled, onChange }: IProps) => JSX.Element;
export default Switch;
