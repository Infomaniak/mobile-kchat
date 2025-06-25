import React from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * The participant id of the toggle camera requester.
     */
    initiatorId: string;
    /**
     * Function to be invoked after permission to toggle camera granted.
     */
    onAllow: () => void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
