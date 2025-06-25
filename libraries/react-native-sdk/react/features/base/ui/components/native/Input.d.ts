import React from 'react';
import { KeyboardTypeOptions, NativeSyntheticEvent, ReturnKeyTypeOptions, TextInput, TextInputFocusEventData, TextInputKeyPressEventData } from 'react-native';
import { IInputProps } from '../types';
export interface IProps extends IInputProps {
    accessibilityLabel?: any;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
    autoFocus?: boolean;
    blurOnSubmit?: boolean | undefined;
    bottomLabel?: string;
    customStyles?: ICustomStyles;
    editable?: boolean | undefined;
    /**
     * The id to set on the input element.
     * This is required because we need it internally to tie the input to its
     * info (label, error) so that screen reader users don't get lost.
     */
    id?: string;
    keyboardType?: KeyboardTypeOptions;
    maxLength?: number | undefined;
    minHeight?: number | string | undefined;
    multiline?: boolean | undefined;
    numberOfLines?: number | undefined;
    onBlur?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined;
    onFocus?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined;
    onKeyPress?: ((e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void) | undefined;
    onSubmitEditing?: (value: string) => void;
    pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto' | undefined;
    returnKeyType?: ReturnKeyTypeOptions | undefined;
    secureTextEntry?: boolean | undefined;
    textContentType?: any;
}
interface ICustomStyles {
    container?: Object;
    input?: Object;
}
declare const Input: React.ForwardRefExoticComponent<IProps & React.RefAttributes<TextInput>>;
export default Input;
