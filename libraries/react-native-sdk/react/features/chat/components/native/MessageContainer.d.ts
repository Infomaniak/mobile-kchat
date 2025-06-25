import React from 'react';
import { IProps as AbstractProps } from '../AbstractMessageContainer';
export interface IProps extends AbstractProps {
    /**
     * Function to be used to translate i18n labels.
     */
    t: Function;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-i18next").WithTranslation, keyof import("react-i18next").WithTranslation>>;
export default _default;
