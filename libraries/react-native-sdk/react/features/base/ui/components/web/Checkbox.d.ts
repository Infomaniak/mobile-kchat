import React from 'react';
interface ICheckboxProps {
    /**
     * Whether the input is checked or not.
     */
    checked?: boolean;
    /**
     * Class name for additional styles.
     */
    className?: string;
    /**
     * Whether the input is disabled or not.
     */
    disabled?: boolean;
    /**
     * The label of the input.
     */
    label: string;
    /**
     * The name of the input.
     */
    name?: string;
    /**
     * Change callback.
     */
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
declare const Checkbox: ({ checked, className, disabled, label, name, onChange }: ICheckboxProps) => JSX.Element;
export default Checkbox;
