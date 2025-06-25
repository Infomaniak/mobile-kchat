import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link DialInNumber}.
 */
export interface IProps extends WithTranslation {
    /**
     * The numeric identifier for the current conference, used after dialing a
     * the number to join the conference.
     */
    conferenceID: string | number;
    /**
     * The phone number to dial to begin the process of dialing into a
     * conference.
     */
    phoneNumber: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
