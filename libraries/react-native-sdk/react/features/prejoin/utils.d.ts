export declare const countries: {
    name: string;
    dialCode: string;
    code: string;
}[];
/**
 * Returns the corresponding country code from a phone number.
 *
 * @param {string} phoneNumber - The phone number.
 * @returns {string}
 */
export declare function getCountryCodeFromPhone(phoneNumber: string): string;
/**
 * Returns the corresponding country for a text starting with the dial code.
 *
 * @param {string} text - The text containing the dial code.
 * @returns {Object}
 */
export declare function getCountryFromDialCodeText(text: string): any;
/**
 * Returns whether the display name is present.
 *
 * @param {string} value - The display name.
 * @returns {boolean}
 */
export declare const hasDisplayName: (value: string) => boolean;
