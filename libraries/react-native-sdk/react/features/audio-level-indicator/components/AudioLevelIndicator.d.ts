import { Component } from 'react';
/**
 * The type of the React {@code Component} props of {@link AudioLevelIndicator}.
 */
export interface IProps {
    /**
     * The current audio level to display. The value should be a number between
     * 0 and 1.
     */
    audioLevel: number;
}
/**
 * Creates a ReactElement responsible for drawing audio levels.
 *
 * @augments {Component}
 */
declare class AudioLevelIndicator extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
export default AudioLevelIndicator;
