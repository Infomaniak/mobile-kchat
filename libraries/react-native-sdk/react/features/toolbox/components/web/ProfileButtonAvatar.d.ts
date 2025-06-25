import React, { Component } from 'react';
import { ILocalParticipant } from '../../../base/participants/types';
/**
 * The type of the React {@code Component} props of
 * {@link ProfileButtonAvatar}.
 */
export interface IProps {
    /**
     * The redux representation of the local participant.
     */
    _localParticipant?: ILocalParticipant;
}
/**
 * A React {@code Component} for displaying a profile avatar as an
 * icon.
 *
 * @augments Component
 */
declare class ProfileButtonAvatar extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof ProfileButtonAvatar, import("react-redux").Omit<React.ClassAttributes<ProfileButtonAvatar> & IProps, "_localParticipant">>;
export default _default;
