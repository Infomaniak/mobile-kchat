/// <reference types="react" />
import { MultiSelectItem } from '../types';
export interface IProps {
    autoFocus?: boolean;
    disabled?: boolean;
    error?: boolean;
    errorDialog?: JSX.Element | null;
    filterValue?: string;
    id: string;
    isOpen?: boolean;
    items: MultiSelectItem[];
    noMatchesText?: string;
    onFilterChange?: (value: string) => void;
    onRemoved: (item: any) => void;
    onSelected: (item: any) => void;
    placeholder?: string;
    selectedItems?: MultiSelectItem[];
}
declare const MultiSelect: ({ autoFocus, disabled, error, errorDialog, placeholder, id, items, filterValue, onFilterChange, isOpen, noMatchesText, onSelected, selectedItems, onRemoved }: IProps) => JSX.Element;
export default MultiSelect;
