import React, { Component } from 'react';
import { IProps } from '../../types';
/**
 * The type of the React {@code Component} props of {@link DisplayNamePrompt}.
 */
export interface IState {
    /**
     * The name to show in the display name text field.
     */
    displayName: string;
    /**
     * The result of the input validation.
     */
    isValid: boolean;
}
/**
 * Implements a React {@code Component} for displaying a dialog with an field
 * for setting the local participant's display name.
 *
 * @augments Component
 */
declare class DisplayNamePrompt extends Component<IProps, IState> {
    _onSetDisplayName: (displayName: string) => boolean;
    /**
     * Initializes a new {@code DisplayNamePrompt} instance.
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
     * Updates the entered display name.
     *
     * @param {string} value - The new value of the input.
     * @private
     * @returns {void}
     */
    _onDisplayNameChange(value: string): void;
    /**
     * Dispatches an action to update the local participant's display name. A
     * name must be entered for the action to dispatch.
     *
     * @private
     * @returns {boolean}
     */
    _onSubmit(): boolean;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<DisplayNamePrompt> & IProps, "dispatch">, keyof import("react-i18next").WithTranslation>>;
export default _default;
