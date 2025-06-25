import React, { Component } from 'react';
import { TOOLTIP_POSITION } from '../../../base/ui/constants.any';
/**
 * The type of the React {@code Component} props of {@link ReactionButton}.
 */
export interface IProps {
    /**
     * A succinct description of what the button does. Used by accessibility
     * tools and torture tests.
     */
    accessibilityLabel: string;
    /**
     * The Icon of this {@code AbstractToolbarButton}.
     */
    icon: Object;
    /**
     * The style of the Icon of this {@code AbstractToolbarButton}.
     */
    iconStyle?: Object;
    /**
     * Optional label for the button.
     */
    label?: string;
    /**
     * On click handler.
     */
    onClick: Function;
    /**
     * {@code AbstractToolbarButton} Styles.
     */
    style?: Array<string> | Object;
    /**
     * An optional modifier to render the button toggled.
     */
    toggled?: boolean;
    /**
     * Optional text to display in the tooltip.
     */
    tooltip?: string;
    /**
     * From which direction the tooltip should appear, relative to the
     * button.
     */
    tooltipPosition: TOOLTIP_POSITION;
    /**
     * The color underlying the button.
     */
    underlayColor?: any;
}
/**
 * The type of the React {@code Component} state of {@link ReactionButton}.
 */
export interface IState {
    /**
     * Used to determine zoom level on reaction burst.
     */
    increaseLevel: number;
    /**
     * Timeout ID to reset reaction burst.
     */
    increaseTimeout: number | null;
}
/**
 * Represents a button in the reactions menu.
 *
 * @augments AbstractToolbarButton
 */
declare class ReactionButton extends Component<IProps, IState> {
    /**
     * Default values for {@code ReactionButton} component's properties.
     *
     * @static
     */
    static defaultProps: {
        tooltipPosition: string;
    };
    /**
     * Initializes a new {@code ReactionButton} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Handles clicking/pressing this {@code AbstractToolbarButton} by
     * forwarding the event to the {@code onClick} prop of this instance if any.
     *
     * @protected
     * @returns {*} The result returned by the invocation of the {@code onClick}
     * prop of this instance if any.
     */
    _onClick(...args: any): any;
    /**
     * Handles 'Enter' key on the button to trigger onClick for accessibility.
     * We should be handling Space onKeyUp but it conflicts with PTT.
     *
     * @param {Object} event - The key event.
     * @private
     * @returns {void}
     */
    _onKeyDown(event: React.KeyboardEvent): void;
    /**
     * Handles reaction button click.
     *
     * @param {Event} event - The click event.
     * @returns {void}
     */
    _onClickHandler(event: any): void;
    /**
     * Renders the button of this {@code ReactionButton}.
     *
     * @param {Object} children - The children, if any, to be rendered inside
     * the button. Presumably, contains the emoji of this {@code ReactionButton}.
     * @protected
     * @returns {ReactElement} The button of this {@code ReactionButton}.
     */
    _renderButton(children: React.ReactElement): JSX.Element;
    /**
     * Renders the icon (emoji) of this {@code reactionButton}.
     *
     * @inheritdoc
     */
    _renderIcon(): JSX.Element;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
export default ReactionButton;
