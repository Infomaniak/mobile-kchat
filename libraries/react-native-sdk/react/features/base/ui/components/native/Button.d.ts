import React from 'react';
import { IButtonProps } from '../types';
export interface IProps extends IButtonProps {
    color?: string | undefined;
    contentStyle?: Object | undefined;
    labelStyle?: Object | undefined;
    mode?: any;
    style?: Object | undefined;
}
declare const Button: React.FC<IProps>;
export default Button;
