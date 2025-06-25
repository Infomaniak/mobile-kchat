/// <reference types="react" />
export interface IProps {
    /**
     * Country of the entry.
     */
    country: {
        code: string;
        dialCode: string;
        name: string;
    };
    /**
     * Entry click handler.
     */
    onEntryClick: Function;
}
declare const CountryRow: ({ country, onEntryClick }: IProps) => JSX.Element;
export default CountryRow;
