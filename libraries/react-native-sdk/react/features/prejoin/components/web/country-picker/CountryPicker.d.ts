/// <reference types="react" />
export interface IProps {
    /**
     * The country to dial out to.
     */
    dialOutCountry: {
        code: string;
        dialCode: string;
        name: string;
    };
    /**
     * The number to dial out to.
     */
    dialOutNumber: string;
    /**
     * Handler used when user presses 'Enter'.
     */
    onSubmit: Function;
    /**
     * Sets the dial out country.
     */
    setDialOutCountry: Function;
    /**
     * Sets the dial out number.
     */
    setDialOutNumber: Function;
}
declare const _default: import("react-redux").ConnectedComponent<(props: IProps) => JSX.Element, import("react-redux").Omit<IProps, "setDialOutCountry" | "setDialOutNumber" | "dialOutCountry" | "dialOutNumber">>;
export default _default;
