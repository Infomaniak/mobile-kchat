import React, { Component } from 'react';
export interface IProps {
    /**
     * True if the hand is raised for this participant.
     */
    _raisedHand?: boolean;
    /**
     * The participant id who we want to render the raised hand indicator
     * for.
     */
    participantId: string;
}
/**
 * Thumbnail badge showing that the participant would like to speak.
 *
 * @augments Component
 */
declare class RaisedHandIndicator extends Component<IProps> {
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element | null;
    /**
     * Renders the platform specific indicator element.
     *
     * @returns {React$Element<*>}
     */
    _renderIndicator(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof RaisedHandIndicator, import("react-redux").Omit<React.ClassAttributes<RaisedHandIndicator> & IProps, "_raisedHand"> & IProps>;
export default _default;
