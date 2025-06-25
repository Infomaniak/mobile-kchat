import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of {@DisplayNameForm}.
 */
export interface IProps extends WithTranslation {
    /**
     * Invoked to set the local participant display name.
     */
    dispatch: IStore['dispatch'];
    /**
     * Whether the polls feature is enabled or not.
     */
    isPollsEnabled: boolean;
}
/**
 * The type of the React {@code Component} state of {@DisplayNameForm}.
 */
export interface IState {
    /**
     * User provided display name when the input text is provided in the view.
     */
    displayName: string;
}
/**
 * React Component for requesting the local participant to set a display name.
 *
 * @augments Component
 */
declare class DisplayNameForm extends Component<IProps, IState> {
    state: {
        displayName: string;
    };
    /**
     * Initializes a new {@code DisplayNameForm} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Dispatches an action update the entered display name.
     *
     * @param {string} value - Keyboard event.
     * @private
     * @returns {void}
     */
    _onDisplayNameChange(value: string): void;
    /**
     * Dispatches an action to hit enter to change your display name.
     *
     * @param {event} event - Keyboard event
     * that will check if user has pushed the enter key.
     * @private
     * @returns {void}
     */
    _onSubmit(event: any): void;
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyPress(e: React.KeyboardEvent): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<DisplayNameForm> & IProps, "dispatch">, keyof WithTranslation>>;
export default _default;
