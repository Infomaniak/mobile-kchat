import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link TimeElapsed}.
 */
export interface IProps extends WithTranslation {
    /**
     * Style for text.
     */
    style: Object;
    /**
     * The milliseconds to be converted into a human-readable format.
     */
    time: number;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
