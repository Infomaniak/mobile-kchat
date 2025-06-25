/// <reference types="react" />
import { IReduxState, IStore } from '../../../app/types';
import AbstractConnectionIndicator, { IProps as AbstractProps } from '../AbstractConnectionIndicator';
type IProps = AbstractProps & {
    /**
     * Whether connection indicators are disabled or not.
     */
    _connectionIndicatorDisabled: boolean;
    /**
     * Whether the inactive connection indicator is disabled or not.
     */
    _connectionIndicatorInactiveDisabled: boolean;
    /**
     * Whether the connection is inactive or not.
     */
    _isConnectionStatusInactive?: boolean;
    /**
     * Whether the connection is interrupted or not.
     */
    _isConnectionStatusInterrupted?: boolean;
    /**
     * Whether the current participant is a virtual screenshare.
     */
    _isVirtualScreenshareParticipant: boolean;
    /**
     * Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Icon style override.
     */
    iconStyle?: any;
};
type IState = {
    autoHideTimeout: number | undefined;
    showIndicator: boolean;
    stats: any;
};
/**
 * Implements an indicator to show the quality of the connection of a participant.
 */
declare class ConnectionIndicator extends AbstractConnectionIndicator<IProps, IState> {
    /**
     * Initializes a new {@code ConnectionIndicator} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Get the icon configuration from CONNECTOR_INDICATOR_COLORS which has a percentage
     * that matches or exceeds the passed in percentage. The implementation
     * assumes CONNECTOR_INDICATOR_COLORS is already sorted by highest to lowest
     * percentage.
     *
     * @param {number} percent - The connection percentage, out of 100, to find
     * the closest matching configuration for.
     * @private
     * @returns {Object}
     */
    _getDisplayConfiguration(percent: number): any;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element | null;
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState, ownProps: any): {
    _connectionIndicatorInactiveDisabled: boolean;
    _connectionIndicatorDisabled: boolean;
    _isVirtualScreenshareParticipant: boolean;
    _isConnectionStatusInactive: boolean | undefined;
    _isConnectionStatusInterrupted: boolean | undefined;
    _autoHideTimeout: number;
};
declare const _default: import("react-redux").ConnectedComponent<typeof ConnectionIndicator, any>;
export default _default;
