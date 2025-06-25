import React from 'react';
import { WithTranslation } from 'react-i18next';
import { type Image } from '../constants';
export interface IProps extends WithTranslation {
    /**
     * Callback used to set the 'loading' state of the parent component.
     */
    setLoading: Function;
    /**
     * Callback used to set the options.
     */
    setOptions: Function;
    /**
     * Callback used to set the storedImages array.
     */
    setStoredImages: Function;
    /**
     * If a label should be displayed alongside the button.
     */
    showLabel: boolean;
    /**
     * A list of images locally stored.
     */
    storedImages: Array<Image>;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
