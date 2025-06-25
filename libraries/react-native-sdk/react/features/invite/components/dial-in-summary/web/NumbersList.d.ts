import React from 'react';
import { WithTranslation } from 'react-i18next';
interface INormalizedNumber {
    /**
     * The country code.
     */
    countryCode?: string;
    /**
     * The formatted number.
     */
    formattedNumber: string;
    /**
     * Whether the number is toll-free.
     */
    tollFree?: boolean;
}
interface INumbersMapping {
    [countryName: string]: Array<INormalizedNumber>;
}
export interface IProps extends WithTranslation {
    /**
     * Whether or not numbers should include links with the telephone protocol.
     */
    clickableNumbers: boolean;
    /**
     * The conference ID for dialing in.
     */
    conferenceID: number | null;
    /**
     * The phone numbers to display. Can be an array of number Objects or an
     * object with countries as keys and an array of numbers as values.
     */
    numbers: INumbersMapping | null;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
