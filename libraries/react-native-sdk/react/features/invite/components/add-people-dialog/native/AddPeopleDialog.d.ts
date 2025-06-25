import React from 'react';
import { WithTranslation } from 'react-i18next';
import { type IProps as AbstractProps, type IState as AbstractState } from '../AbstractAddPeopleDialog';
export interface IProps extends AbstractProps, WithTranslation {
    /**
     * True if the invite dialog should be open, false otherwise.
     */
    _isVisible: boolean;
    /**
     * Default prop for navigation between screen components(React Navigation).
     */
    navigation: any;
    /**
     * Theme used for styles.
     */
    theme: Object;
}
export interface IState extends AbstractState {
    /**
     * Boolean to show if an extra padding needs to be added to the bottom bar.
     */
    bottomPadding: boolean;
    /**
     * State variable to keep track of the search field value.
     */
    fieldValue: string;
    /**
     * True if a search is in progress, false otherwise.
     */
    searchInprogress: boolean;
    /**
     * An array of items that are selectable on this dialog. This is usually
     * populated by an async search.
     */
    selectableItems: Array<Object>;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof WithTranslation>>;
export default _default;
