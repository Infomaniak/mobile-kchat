/// <reference types="react" />
export interface IProps {
    /**
     * Click handler for a single entry.
     */
    onEntryClick: Function;
}
/**
 * This component displays the dropdown for the country picker.
 *
 * @returns {ReactElement}
 */
declare function CountryDropdown({ onEntryClick }: IProps): JSX.Element;
export default CountryDropdown;
