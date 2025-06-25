/// <reference types="react" />
export interface IProps {
    /**
     * Country object of the entry.
     */
    country: {
        code: string;
        dialCode: string;
        name: string;
    };
    /**
     * Click handler for the selector.
     */
    onClick: () => void;
}
/**
 * This component displays the country selector with the flag.
 *
 * @returns {ReactElement}
 */
declare function CountrySelector({ country: { code, dialCode }, onClick }: IProps): JSX.Element;
export default CountrySelector;
