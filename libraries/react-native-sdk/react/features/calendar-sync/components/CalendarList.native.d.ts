import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
import AbstractPage from '../../base/react/components/AbstractPage';
/**
 * The tyoe of the React {@code Component} props of {@link CalendarList}.
 */
export interface IProps extends WithTranslation {
    /**
     * The current state of the calendar access permission.
     */
    _authorization?: string;
    /**
     * Indicates if the list is disabled or not.
     */
    disabled: boolean;
}
/**
 * Component to display a list of events from the (mobile) user's calendar.
 */
declare class CalendarList extends AbstractPage<IProps> {
    /**
     * Initializes a new {@code CalendarList} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Public API method for {@code Component}s rendered in
     * {@link AbstractPagedList}. When invoked, refreshes the calendar entries
     * in the app.
     *
     * @param {Function} dispatch - The Redux dispatch function.
     * @param {boolean} isInteractive - If true this refresh was caused by
     * direct user interaction, false otherwise.
     * @public
     * @returns {void}
     */
    static refresh(dispatch: IStore['dispatch'], isInteractive: boolean): void;
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element | null;
    /**
     * Returns a list empty component if a custom one has to be rendered instead
     * of the default one in the {@link NavigateSectionList}.
     *
     * @private
     * @returns {?React$Component}
     */
    _getRenderListEmptyComponent(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<CalendarList> & IProps, "_authorization">, keyof WithTranslation>>;
export default _default;
