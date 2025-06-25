import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../../app/types';
export interface IProps extends WithTranslation {
    /**
     * The notifications to be displayed, with the first index being the
     * notification at the top and the rest shown below it in order.
     */
    _notifications: Array<Object>;
    /**
     * Invoked to update the redux store in order to remove notifications.
     */
    dispatch: IStore['dispatch'];
    /**
     * Whether or not the layout should change to support tile view mode.
     */
    shouldDisplayTileView: boolean;
    /**
     * Checks toolbox visibility.
     */
    toolboxVisible: boolean;
}
/**
 * Implements a React {@link Component} which displays notifications and handles
 * automatic dismissal after a notification is shown for a defined timeout
 * period.
 *
 * @augments {Component}
 */
declare class NotificationsContainer extends Component<IProps> {
    /**
     * A timeout id returned by setTimeout.
     */
    _notificationDismissTimeout: any;
    /**
     * Initializes a new {@code NotificationsContainer} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Sets a timeout (if applicable).
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Sets a timeout if the currently displayed notification has changed.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Sets/clears the dismiss timeout for the top notification.
     *
     * @param {IProps} [prevProps] - The previous properties (if called from
     * {@code componentDidUpdate}).
     * @returns {void}
     * @private
     */
    _manageDismissTimeout(prevProps: IProps): void;
    /**
     * Clear any dismissal timeout that is still active.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
     * Clears the running notification dismiss timeout, if any.
     *
     * @returns {void}
     */
    _clearNotificationDismissTimeout(): void;
    /**
     * Emits an action to remove the notification from the redux store so it
     * stops displaying.
     *
     * @param {Object} uid - The id of the notification to be removed.
     * @private
     * @returns {void}
     */
    _onDismissed(uid: any): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
/**
 * Maps (parts of) the Redux state to the associated NotificationsContainer's
 * props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
export declare function mapStateToProps(state: IReduxState): {
    _notifications: import("../../reducer").INotification[];
};
declare const _default: import("react-redux").ConnectedComponent<typeof NotificationsContainer, import("react-redux").Omit<React.ClassAttributes<NotificationsContainer> & IProps, "dispatch" | "_notifications">>;
export default _default;
