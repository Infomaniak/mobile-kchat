import React from 'react';
import { WithTranslation } from 'react-i18next';
interface IMeeting {
    date: Date;
    duration?: number;
    elementAfter?: React.ReactElement;
    time: Date[];
    title: string;
    url: string;
}
export interface IProps extends WithTranslation {
    /**
     * Indicates if the list is disabled or not.
     */
    disabled: boolean;
    /**
     * Indicates if the URL should be hidden or not.
     */
    hideURL?: boolean;
    /**
     * Rendered when the list is empty. Should be a rendered element.
     */
    listEmptyComponent: React.ReactNode;
    /**
     * An array of meetings.
     */
    meetings: IMeeting[];
    /**
     * Handler for deleting an item.
     */
    onItemDelete?: Function;
    /**
     * Function to be invoked when an item is pressed. The item's URL is passed.
     */
    onPress: Function;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
