/// <reference types="react" />
import { ColorValue } from 'react-native';
import { ISwitchProps } from '../types';
export interface IProps extends ISwitchProps {
    /**
     * Custom styles for the switch.
     */
    style?: Object;
    /**
     * Color of the switch button.
     */
    thumbColor?: ColorValue;
    /**
     * Color of the switch background.
     */
    trackColor?: Object;
}
declare const Switch: ({ checked, disabled, onChange, thumbColor, trackColor, style }: IProps) => JSX.Element;
export default Switch;
