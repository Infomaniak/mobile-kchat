import React from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * The URL of the conference.
     */
    url: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<IProps, "url">, keyof WithTranslation>>;
export default _default;
