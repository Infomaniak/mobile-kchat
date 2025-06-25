import React from 'react';
import { IInputProps } from '../types';
export interface IProps extends IInputProps {
    accessibilityLabel?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    bottomLabel?: string;
    className?: string;
    iconClick?: () => void;
    /**
     * The id to set on the input element.
     * This is required because we need it internally to tie the input to its
     * info (label, error) so that screen reader users don't get lost.
     */
    id: string;
    maxLength?: number;
    maxRows?: number;
    maxValue?: number;
    minRows?: number;
    minValue?: number;
    mode?: 'text' | 'none' | 'decimal' | 'numeric' | 'tel' | 'search' | ' email' | 'url';
    name?: string;
    onBlur?: (e: any) => void;
    onFocus?: (event: React.FocusEvent) => void;
    onKeyPress?: (e: React.KeyboardEvent) => void;
    readOnly?: boolean;
    required?: boolean;
    testId?: string;
    textarea?: boolean;
    type?: 'text' | 'email' | 'number' | 'password';
}
declare const Input: React.ForwardRefExoticComponent<IProps & React.RefAttributes<any>>;
export default Input;
