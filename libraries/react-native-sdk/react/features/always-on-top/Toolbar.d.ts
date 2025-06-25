import React, { Component } from 'react';
/**
 * The type of the React {@code Component} props of {@link Toolbar}.
 */
export interface IProps {
    /**
     * Additional CSS class names to add to the root of the toolbar.
     */
    className: string;
    /**
     * Callback invoked when no longer moused over the toolbar.
     */
    onMouseOut: (e?: React.MouseEvent) => void;
    /**
     * Callback invoked when the mouse has moved over the toolbar.
     */
    onMouseOver: (e?: React.MouseEvent) => void;
}
/**
 * Represents the toolbar in the Always On Top window.
 *
 * @augments Component
 */
export default class Toolbar extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
