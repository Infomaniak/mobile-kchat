import React from 'react';
import { WithTranslation } from 'react-i18next';
import AbstractDialog, { IProps as AbstractProps } from './AbstractDialog';
export interface IProps extends AbstractProps, WithTranslation {
    /**
     * Untranslated i18n key of the content to be displayed.
     *
     * NOTE: This dialog also adds support to Object type keys that will be
     * translated using the provided params. See i18n function
     * {@code translate(string, Object)} for more details.
     */
    contentKey: string | {
        key: string;
        params: Object;
    };
}
/**
 * Implements an alert dialog, to simply show an error or a message,
 * then disappear on dismiss.
 */
declare class AlertDialog extends AbstractDialog<IProps> {
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<AlertDialog> & IProps, "dispatch">, keyof WithTranslation>>;
export default _default;
