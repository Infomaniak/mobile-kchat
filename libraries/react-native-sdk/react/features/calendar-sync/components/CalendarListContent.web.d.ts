import React, { Component } from 'react';
import { IStore } from '../../app/types';
/**
 * The type of the React {@code Component} props of
 * {@link CalendarListContent}.
 */
export interface IProps {
    /**
     * The calendar event list.
     */
    _eventList: Array<Object>;
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
    listEmptyComponent: React.ReactNode;
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
     * @param {Object} event - The click event.
     * @param {string} url - The url string to navigate to.
     * @returns {void}
     */
    _onJoinPress(event: React.KeyboardEvent, url: string): void;
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
     * Creates a displayable object from an event.
     *
     * @param {Object} event - The calendar event.
     * @private
     * @returns {Object}
     */
    _toDisplayableItem(event: any): {
        elementAfter: JSX.Element;
        date: any;
        time: any[];
        description: any;
        title: any;
        url: any;
    };
}
declare const _default: import("react-redux").ConnectedComponent<typeof CalendarListContent, import("react-redux").Omit<Pick<React.ClassAttributes<CalendarListContent> & IProps, "disabled" | "dispatch" | "listEmptyComponent" | keyof React.ClassAttributes<CalendarListContent>> & Partial<Pick<React.ClassAttributes<CalendarListContent> & IProps, "_eventList">> & Partial<Pick<{
    _eventList: never[];
}, never>>, "dispatch" | "_eventList">>;
export default _default;
