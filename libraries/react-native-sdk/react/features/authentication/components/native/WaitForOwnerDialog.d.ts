import React from 'react';
import { IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of {@link WaitForOwnerDialog}.
 */
export interface IProps {
    /**
     * Whether to show alternative cancel button text.
     */
    _alternativeCancelText?: boolean;
    /**
     * Is confirm button hidden?
     */
    _isConfirmHidden?: boolean;
    /**
     * Redux store dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Invoked to obtain translated strings.
     */
    t: Function;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-i18next").WithTranslation, keyof import("react-i18next").WithTranslation>>;
export default _default;
