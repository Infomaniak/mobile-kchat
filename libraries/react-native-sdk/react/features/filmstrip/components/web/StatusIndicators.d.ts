import { Component } from 'react';
/**
 * The type of the React {@code Component} props of {@link StatusIndicators}.
 */
export interface IProps {
    /**
     * Indicates if the audio muted indicator should be visible or not.
     */
    _showAudioMutedIndicator: Boolean;
    /**
     * Indicates if the moderator indicator should be visible or not.
     */
    _showModeratorIndicator: Boolean;
    /**
     * Indicates if the screen share indicator should be visible or not.
     */
    _showScreenShareIndicator: Boolean;
    /**
     * The ID of the participant for which the status bar is rendered.
     */
    participantID: String;
    /**
     * The type of thumbnail.
     */
    thumbnailType: string;
}
/**
 * React {@code Component} for showing the status bar in a thumbnail.
 *
 * @augments Component
 */
declare class StatusIndicators extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof StatusIndicators, any>;
export default _default;
