import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
/**
 * The type of the React {@code Component} props of
 * {@link CalendarListContent}.
 */
export interface IProps extends WithTranslation {
    /**
     * The calendar event list.
     */
    _eventList: Array<any>;
    /**
     * Indicates if the list is disabled or not.
     */
    disabled: boolean;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     *
     */
    listEmptyComponent: React.ReactElement<any>;
}
/**
 * Component to display a list of events from a connected calendar.
 */
declare class CalendarListContent extends Component<IProps> {
    /**
     * Default values for the component's props.
     */
    static defaultProps: {
        _eventList: never[];
    };
    /**
     * Initializes a new {@code CalendarListContent} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Handles the list's navigate action.
     *
     * @private
     * @param {string} url - The url string to navigate to.
     * @param {string} analyticsEventName - Тhe name of the analytics event
     * associated with this action.
     * @returns {void}
     */
    _onPress(url: string, analyticsEventName?: string): void;
    /**
     * Callback to execute when the list is doing a pull-to-refresh.
     *
     * @private
     * @returns {void}
     */
    _onRefresh(): void;
    /**
     * Handles the list's secondary action.
     *
     * @private
     * @param {string} id - The ID of the item on which the secondary action was
     * performed.
     * @returns {void}
     */
    _onSecondaryAction(id: string): void;
    /**
     * Generates a date string for a given event.
     *
     * @param {Object} event - The event.
     * @private
     * @returns {string}
     */
    _toDateString(event: any): string;
    /**
     * Creates a displayable object from an event.
     *
     * @param {Object} event - The calendar event.
     * @private
     * @returns {Object}
     */
    _toDisplayableItem(event: any): {
        id: any;
        key: string;
        lines: any[];
        title: any;
        url: any;
    };
    /**
     * Transforms the event list to a displayable list with sections.
     *
     * @private
     * @returns {Array<Object>}
     */
    _toDisplayableList(): any[];
    /**
     * Generates a time (interval) string for a given event.
     *
     * @param {Object} event - The event.
     * @private
     * @returns {string}
     */
    _toTimeString(event: any): string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<React.ClassAttributes<CalendarListContent> & IProps, "disabled" | "dispatch" | "t" | "i18n" | "tReady" | "listEmptyComponent" | keyof React.ClassAttributes<CalendarListContent>> & Partial<Pick<React.ClassAttributes<CalendarListContent> & IProps, "_eventList">> & Partial<Pick<{
    _eventList: never[];
}, never>>, "dispatch" | "_eventList">, keyof WithTranslation>>;
export default _default;
