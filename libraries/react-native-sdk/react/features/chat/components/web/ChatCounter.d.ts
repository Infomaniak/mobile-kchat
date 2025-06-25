import React, { Component } from 'react';
/**
 * The type of the React {@code Component} props of {@link ChatCounter}.
 */
export interface IProps {
    /**
     * The value of to display as a count.
     */
    _count: number;
    /**
     * True if the chat window should be rendered.
     */
    _isOpen: boolean;
}
/**
 * Implements a React {@link Component} which displays a count of the number of
 * unread chat messages.
 *
 * @augments Component
 */
declare class ChatCounter extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof ChatCounter, import("react-redux").Omit<React.ClassAttributes<ChatCounter> & IProps, "_isOpen" | "_count">>;
export default _default;
