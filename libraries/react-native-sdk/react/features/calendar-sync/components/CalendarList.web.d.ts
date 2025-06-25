import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
import AbstractPage from '../../base/react/components/AbstractPage';
/**
 * The type of the React {@code Component} props of {@link CalendarList}.
 */
export interface IProps extends WithTranslation {
    /**
     * The error object containing details about any error that has occurred
     * while interacting with calendar integration.
     */
    _calendarError?: {
        error: string;
    };
    /**
     * Whether or not a calendar may be connected for fetching calendar events.
     */
    _hasIntegrationSelected: boolean;
    /**
     * Whether or not events have been fetched from a calendar.
     */
    _hasLoadedEvents: boolean;
    /**
     * Indicates if the list is disabled or not.
     */
    disabled?: boolean;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
}
/**
 * Component to display a list of events from the user's calendar.
 */
declare class CalendarList extends AbstractPage<IProps> {
    /**
     * Initializes a new {@code CalendarList} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element | null;
    /**
     * Returns a component for showing the error message related to calendar
     * sync.
     *
     * @private
     * @returns {React$Component}
     */
    _getErrorMessage(): JSX.Element;
    /**
     * Returns a list empty component if a custom one has to be rendered instead
     * of the default one in the {@link NavigateSectionList}.
     *
     * @private
     * @returns {React$Component}
     */
    _getRenderListEmptyComponent(): JSX.Element;
    /**
     * Opens {@code SettingsDialog}.
     *
     * @private
     * @returns {void}
     */
    _onOpenSettings(): void;
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyPressOpenSettings(e: React.KeyboardEvent): void;
    /**
     * Gets an updated list of calendar events.
     *
     * @private
     * @returns {void}
     */
    _onRefreshEvents(): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<CalendarList> & IProps, "dispatch" | "_calendarError" | "_hasIntegrationSelected" | "_hasLoadedEvents">, keyof WithTranslation>>;
export default _default;
