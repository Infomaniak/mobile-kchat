import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link FormSection}.
 */
export interface IProps extends WithTranslation {
    /**
     * The children to be displayed within this Link.
     */
    children: React.ReactNode;
    /**
     * The i18n key of the text label of the section.
     */
    label?: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
