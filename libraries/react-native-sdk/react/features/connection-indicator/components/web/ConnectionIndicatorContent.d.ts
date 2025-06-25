import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../../app/types';
import { IProps as AbstractProps, IState as AbstractState } from '../AbstractConnectionIndicator';
/**
 * The type of the React {@code Component} props of {@link ConnectionIndicator}.
 */
export interface IProps extends AbstractProps, WithTranslation {
    /**
     * The audio SSRC of this client.
     */
    _audioSsrc: number;
    /**
     * Whether or not should display the "Show More" link in the local video
     * stats table.
     */
    _disableShowMoreStats: boolean;
    /**
     * Whether to enable assumed bandwidth.
     */
    _enableAssumedBandwidth?: boolean;
    /**
     * Whether or not should display the "Save Logs" link in the local video
     * stats table.
     */
    _enableSaveLogs: boolean;
    _isConnectionStatusInactive: boolean;
    _isConnectionStatusInterrupted: boolean;
    _isE2EEVerified: boolean;
    /**
     * Whether or not the displays stats are for local video.
     */
    _isLocalVideo: boolean;
    /**
     * Whether is narrow layout or not.
     */
    _isNarrowLayout: boolean;
    /**
     * Invoked to open the bandwidth settings dialog.
     */
    _onOpenBandwidthDialog: () => void;
    /**
     * Invoked to save the conference logs.
     */
    _onSaveLogs: () => void;
    /**
     * The region reported by the participant.
     */
    _region?: string;
    /**
     * The video SSRC of this client.
     */
    _videoSsrc: number;
    /**
     * Css class to apply on container.
     */
    className: string;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Optional param for passing existing connection stats on component instantiation.
     */
    inheritedStats: any;
}
/**
 * The type of the React {@code Component} state of {@link ConnectionIndicator}.
 */
export interface IState extends AbstractState {
    autoHideTimeout?: number;
    /**
     * Whether or not the popover content should display additional statistics.
     */
    showMoreStats: boolean;
}
/**
 * Maps redux actions to the props of the component.
 *
 * @param {Function} dispatch - The redux action {@code dispatch} function.
 * @returns {{
 *     _onSaveLogs: Function,
 * }}
 * @private
 */
export declare function _mapDispatchToProps(dispatch: IStore['dispatch']): {
    /**
     * Saves the conference logs.
     *
     * @returns {Function}
     */
    _onSaveLogs(): void;
    /**
     * Opens the bandwidth settings dialog.
     *
     * @returns {void}
     */
    _onOpenBandwidthDialog(): void;
};
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState, ownProps: any): {
    _audioSsrc: any;
    _disableShowMoreStats: boolean;
    _enableAssumedBandwidth: boolean | undefined;
    _enableSaveLogs: boolean;
    _isConnectionStatusInactive: boolean;
    _isConnectionStatusInterrupted: boolean;
    _isE2EEVerified: boolean;
    _isNarrowLayout: boolean;
    _isVirtualScreenshareParticipant: boolean;
    _isLocalVideo: boolean;
    _region: string | undefined;
    _videoSsrc: any;
};
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof WithTranslation>>;
export default _default;
