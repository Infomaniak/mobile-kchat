import React, { Component } from 'react';
/**
 * {@code TintedView}'s React {@code Component} prop types.
 */
export interface IProps {
    /**
     * The children components of this component.
     */
    children?: React.ReactNode;
    /**
     * Style to override the base style.
     */
    style?: Object;
}
/**
 * Implements a component aimed at covering another view and tinting it with
 * the given color and opacity.
 */
export default class TintedView extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
