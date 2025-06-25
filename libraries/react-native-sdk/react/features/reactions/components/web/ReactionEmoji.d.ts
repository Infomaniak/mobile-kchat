import React, { Component } from 'react';
export interface IProps {
    /**
     * Index of the reaction in the queue.
     */
    index: number;
    /**
     * Reaction to be displayed.
     */
    reaction: string;
    /**
     * Removes reaction from redux state.
     */
    reactionRemove: Function;
    /**
     * Id of the reaction.
     */
    uid: string;
}
export interface IState {
    /**
     * Index of CSS animation. Number between 0-20.
     */
    index: number;
}
/**
 * Used to display animated reactions.
 *
 * @returns {ReactElement}
 */
declare class ReactionEmoji extends Component<IProps, IState> {
    /**
     * Initializes a new {@code ReactionEmoji} instance.
     *
     * @param {IProps} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Implements React Component's componentDidMount.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof ReactionEmoji, import("react-redux").Omit<React.ClassAttributes<ReactionEmoji> & IProps, "reactionRemove">>;
export default _default;
