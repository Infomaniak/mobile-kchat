import React from 'react';
export interface IProps {
    /**
     * The text for the Label.
     */
    children: React.ReactElement;
    /**
     * The CSS class of the label.
     */
    className?: string;
    /**
     * The (round) number prefix for the Label.
     */
    number?: string | number;
    /**
     * The click handler.
     */
    onClick?: (e?: React.MouseEvent) => void;
}
/**
 *  Label for the dialogs.
 *
 *  @returns {ReactElement}
 */
declare function Label({ children, className, number, onClick }: IProps): JSX.Element;
export default Label;
