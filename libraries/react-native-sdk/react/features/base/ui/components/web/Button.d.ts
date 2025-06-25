import React from 'react';
import { IButtonProps } from '../types';
export interface IProps extends IButtonProps {
    /**
     * Class name used for additional styles.
     */
    className?: string;
    /**
     * Whether or not the button should be full width.
     */
    fullWidth?: boolean;
    /**
     * The id of the button.
     */
    id?: string;
    /**
     * Whether or not the button is a submit form button.
     */
    isSubmit?: boolean;
    /**
     * Text to be displayed on the component.
     * Used when there's no labelKey.
     */
    label?: string;
    /**
     * Which size the button should be.
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Data test id.
     */
    testId?: string;
}
declare const Button: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<any>>;
export default Button;
