import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link FormRow}.
 */
export interface IProps extends WithTranslation {
    /**
     * Component's children.
     */
    children: React.ReactElement;
    /**
     * Prop to decide if a row separator is to be rendered.
     */
    fieldSeparator?: boolean;
    /**
     * The i18n key of the text label of the form field.
     */
    label: string;
    /**
     * One of 'row' (default) or 'column'.
     */
    layout?: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
