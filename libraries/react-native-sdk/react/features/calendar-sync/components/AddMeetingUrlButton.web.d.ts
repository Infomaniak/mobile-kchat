import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
/**
 * The type of the React {@code Component} props of {@link AddMeetingUrlButton}.
 */
export interface IProps extends WithTranslation {
    /**
     * The calendar ID associated with the calendar event.
     */
    calendarId: string;
    /**
     * Invoked to add a meeting URL to a calendar event.
     */
    dispatch: IStore['dispatch'];
    /**
     * The ID of the calendar event that will have a meeting URL added on click.
     */
    eventId: string;
}
/**
 * A React Component for adding a meeting URL to an existing calendar event.
 *
 * @augments Component
 */
declare class AddMeetingUrlButton extends Component<IProps> {
    /**
     * Initializes a new {@code AddMeetingUrlButton} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Dispatches an action to adding a meeting URL to a calendar event.
     *
     * @returns {void}
     */
    _onClick(): void;
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyPress(e: React.KeyboardEvent): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<AddMeetingUrlButton> & IProps, "dispatch">, keyof WithTranslation>>;
export default _default;
