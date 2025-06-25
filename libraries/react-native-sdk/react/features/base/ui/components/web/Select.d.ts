import { ChangeEvent } from 'react';
interface ISelectProps {
    /**
     * Helper text to be displayed below the select.
     */
    bottomLabel?: string;
    /**
     * Class name for additional styles.
     */
    className?: string;
    /**
     * Wether or not the select is disabled.
     */
    disabled?: boolean;
    /**
     * Wether or not the select is in the error state.
     */
    error?: boolean;
    /**
     * Id of the <select> element.
     * Necessary for screen reader users, to link the label and error to the select.
     */
    id: string;
    /**
     * Label to be displayed above the select.
     */
    label?: string;
    /**
     * Change handler.
     */
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    /**
     * The options of the select.
     */
    options: Array<{
        label: string;
        value: number | string;
    }>;
    /**
     * The value of the select.
     */
    value: number | string;
}
declare const Select: ({ bottomLabel, className, disabled, error, id, label, onChange, options, value }: ISelectProps) => JSX.Element;
export default Select;
