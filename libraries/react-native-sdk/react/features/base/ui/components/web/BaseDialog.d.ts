import { ReactNode } from 'react';
export interface IProps {
    children?: ReactNode;
    className?: string;
    description?: string;
    disableBackdropClose?: boolean;
    disableEnter?: boolean;
    disableEscape?: boolean;
    onClose?: () => void;
    size?: 'large' | 'medium';
    submit?: () => void;
    testId?: string;
    title?: string;
    titleKey?: string;
}
declare const BaseDialog: ({ children, className, description, disableBackdropClose, disableEnter, disableEscape, onClose, size, submit, testId, title, titleKey }: IProps) => JSX.Element;
export default BaseDialog;
