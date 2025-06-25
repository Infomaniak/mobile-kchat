import React, { Component } from 'react';
import { ILocalParticipant } from '../../../base/participants/types';
import { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link RaiseHandButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether this button is enabled or not.
     */
    _enabled: boolean;
    /**
     * The local participant.
     */
    _localParticipant?: ILocalParticipant;
    /**
     * Whether the participant raused their hand or not.
     */
    _raisedHand: boolean;
    /**
     * Used to close the overflow menu after raise hand is clicked.
     */
    onCancel: Function;
}
/**
 * An implementation of a button to raise or lower hand.
 */
declare class RaiseHandButton extends Component<IProps> {
    accessibilityLabel: string;
    label: string;
    toggledLabel: string;
    /**
     * Initializes a new {@code RaiseHandButton} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code RaiseHandButton} instance with.
     */
    constructor(props: IProps);
    /**
     * Handles clicking / pressing the button.
     *
     * @returns {void}
     */
    _onClick(): void;
    /**
     * Toggles the rased hand status of the local participant.
     *
     * @returns {void}
     */
    _toggleRaisedHand(): void;
    /**
     * Gets the current label, taking the toggled state into account. If no
     * toggled label is provided, the regular label will also be used in the
     * toggled state.
     *
     * @returns {string}
     */
    _getLabel(): string;
    /**
     * Renders the "raise hand" emoji.
     *
     * @returns {ReactElement}
     */
    _renderRaiseHandEmoji(): JSX.Element;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element | null;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<RaiseHandButton> & IProps, "dispatch" | "_raisedHand" | "_localParticipant" | "_enabled">, keyof import("react-i18next").WithTranslation>>;
export default _default;
