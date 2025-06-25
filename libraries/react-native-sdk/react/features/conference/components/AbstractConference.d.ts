import React, { Component } from 'react';
import { IReduxState } from '../../app/types';
/**
 * The type of the React {@code Component} props of {@link AbstractLabels}.
 */
export type AbstractProps = {
    /**
     * Set to {@code true} when the notifications are to be displayed.
     *
     * @protected
     * @type {boolean}
     */
    _notificationsVisible: boolean;
    /**
     * Conference room name.
     *
     * @protected
     * @type {string}
     */
    _room: string;
    /**
     * Whether or not the layout should change to support tile view mode.
     *
     * @protected
     * @type {boolean}
     */
    _shouldDisplayTileView: boolean;
};
/**
 * A container to hold video status labels, including recording status and
 * current large video quality.
 *
 * @augments Component
 */
export declare class AbstractConference<P extends AbstractProps, S> extends Component<P, S> {
    /**
     * Renders the {@code LocalRecordingLabel}.
     *
     * @param {Object} props - The properties to be passed to
     * the {@code NotificationsContainer}.
     * @protected
     * @returns {React$Element}
     */
    renderNotificationsContainer(props?: any): React.FunctionComponentElement<import("react-redux").Omit<import("../../notifications/components/web/NotificationsContainer").IProps, "dispatch" | "_isChatOpen" | "_iAmSipGateway" | "_notifications">> | null;
}
/**
 * Maps (parts of) the redux state to the associated props of the {@link Labels}
 * {@code Component}.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {AbstractProps}
 */
export declare function abstractMapStateToProps(state: IReduxState): {
    _notificationsVisible: boolean;
    _room: string;
    _shouldDisplayTileView: boolean;
};
