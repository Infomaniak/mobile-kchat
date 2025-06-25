import React from 'react';
import { IProps as IBaseDialogProps } from './BaseDialog';
interface IDialogProps extends IBaseDialogProps {
    back?: {
        hidden?: boolean;
        onClick?: () => void;
        translationKey?: string;
    };
    cancel?: {
        hidden?: boolean;
        translationKey?: string;
    };
    children?: React.ReactNode;
    disableAutoHideOnSubmit?: boolean;
    hideCloseButton?: boolean;
    ok?: {
        disabled?: boolean;
        hidden?: boolean;
        translationKey?: string;
    };
    onCancel?: () => void;
    onSubmit?: () => void;
}
declare const Dialog: ({ back, cancel, children, className, description, disableAutoHideOnSubmit, disableBackdropClose, hideCloseButton, disableEnter, disableEscape, ok, onCancel, onSubmit, size, testId, title, titleKey }: IDialogProps) => JSX.Element;
export default Dialog;
