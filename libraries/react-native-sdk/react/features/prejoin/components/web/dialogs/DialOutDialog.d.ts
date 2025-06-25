import React from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * Closes a dialog.
     */
    onClose: (e?: React.MouseEvent) => void;
    /**
     * Submit handler.
     */
    onSubmit: Function;
    /**
     * Handler for text button.
     */
    onTextButtonClick: Function;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
