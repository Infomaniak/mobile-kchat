import React from 'react';
import { WithTranslation } from 'react-i18next';
interface ILanguageListItemProps extends WithTranslation {
    /**
     * Language string.
     */
    lang: string;
    /**
     * Callback for language selection.
     */
    onLanguageSelected: (lang: string) => void;
    /**
     * If language item is selected or not.
     */
    selected?: boolean;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<ILanguageListItemProps, keyof WithTranslation>>;
export default _default;
