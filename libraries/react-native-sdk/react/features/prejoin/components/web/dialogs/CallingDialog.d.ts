import React from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * The phone number that is being called.
     */
    number: string;
    /**
     * Closes the dialog.
     */
    onClose: (e?: React.MouseEvent) => void;
    /**
     * The status of the call.
     */
    status: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
