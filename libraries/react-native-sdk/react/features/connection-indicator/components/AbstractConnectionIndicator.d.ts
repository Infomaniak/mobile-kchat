import { Component } from 'react';
import { IReduxState } from '../../app/types';
/**
 * The connection quality percentage that must be reached to be considered of
 * good quality and can result in the connection indicator being hidden.
 *
 * @type {number}
 */
export declare const INDICATOR_DISPLAY_THRESHOLD = 30;
/**
 * The type of the React {@code Component} props of {@link ConnectionIndicator}.
 */
export interface IProps {
    /**
     * How long the connection indicator should remain displayed before hiding.
     */
    _autoHideTimeout: number;
    /**
     * Whether or not the statistics are for screen share.
     */
    _isVirtualScreenshareParticipant: boolean;
    /**
     * Custom icon style.
     */
    iconStyle?: Object;
    /**
     * The ID of the participant associated with the displayed connection indication and
     * stats.
     */
    participantId: string;
}
/**
 * The type of the React {@code Component} state of {@link ConnectionIndicator}.
 */
export interface IState {
    /**
     * Whether or not a CSS class should be applied to the root for hiding the
     * connection indicator. By default the indicator should start out hidden
     * because the current connection status is not known at mount.
     */
    showIndicator: boolean;
    /**
     * Cache of the stats received from subscribing to stats emitting. The keys
     * should be the name of the stat. With each stat update, updates stats are
     * mixed in with cached stats and a new stats object is set in state.
     */
    stats: {
        bandwidth?: any;
        bitrate?: any;
        bridgeCount?: any;
        codec?: any;
        framerate?: any;
        maxEnabledResolution?: any;
        packetLoss?: any;
        percent?: number;
        resolution?: any;
        serverRegion?: any;
        transport?: any;
    };
}
/**
 * Implements a React {@link Component} which displays the current connection
 * quality.
 *
 * @augments {Component}
 */
declare class AbstractConnectionIndicator<P extends IProps, S extends IState> extends Component<P, S> {
    /**
     * The timeout for automatically hiding the indicator.
     */
    autoHideTimeout: number | undefined;
    /**
     * Initializes a new {@code ConnectionIndicator} instance.
     *
     * @param {P} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: P);
    /**
     * Starts listening for stat updates.
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidMount(): void;
    /**
     * Updates which user's stats are being listened to.
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Cleans up any queued processes, which includes listening for new stats
     * and clearing any timeout to hide the indicator.
     *
     * @private
     * @returns {void}
     */
    componentWillUnmount(): void;
    /**
     * Gets the "real" participant ID. FOr a virtual screenshare participant, that is its "owner".
     *
     * @param {Props} props - The props where to extract the data from.
     * @returns {string | undefined } The resolved participant ID.
     */
    _getRealParticipantId(props: IProps): string;
    /**
     * Callback invoked when new connection stats associated with the passed in
     * user ID are available. Will update the component's display of current
     * statistics.
     *
     * @param {Object} stats - Connection stats from the library.
     * @private
     * @returns {void}
     */
    _onStatsUpdated(stats?: {
        connectionQuality: undefined;
    }): void;
    /**
     * Updates the internal state for automatically hiding the indicator.
     *
     * @param {number} percent - The current connection quality percentage
     * between the values 0 and 100.
     * @private
     * @returns {void}
     */
    _updateIndicatorAutoHide(percent: number): void;
}
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code ConnectorIndicator} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
export declare function mapStateToProps(state: IReduxState): {
    _autoHideTimeout: number;
};
export default AbstractConnectionIndicator;
