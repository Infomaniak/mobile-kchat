import { Theme } from '@mui/material';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../../app/types';
import { ITrack } from '../../../base/tracks/types';
import { IProps as AbstractProps, IState as AbstractState } from '../AbstractConnectionIndicator';
/**
 * The type of the React {@code Component} props of {@link ConnectionIndicator}.
 */
export interface IProps extends AbstractProps, WithTranslation {
    /**
     * Disable/enable inactive indicator.
     */
    _connectionIndicatorInactiveDisabled: boolean;
    /**
     * Whether the connection status is inactive.
     */
    _isConnectionStatusInactive: boolean;
    /**
     * Whether the connection status is interrupted.
     */
    _isConnectionStatusInterrupted?: boolean;
    /**
     * Whether the indicator popover is disabled.
     */
    _popoverDisabled: boolean;
    /**
     * The participant's video track;.
     */
    _videoTrack?: ITrack;
    /**
     * Whether or not the component should ignore setting a visibility class for
     * hiding the component when the connection quality is not strong.
     */
    alwaysVisible: boolean;
    /**
     * The audio SSRC of this client.
     */
    audioSsrc?: number;
    /**
     * An object containing the CSS classes.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Whether or not clicking the indicator should display a popover for more
     * details.
     */
    enableStatsDisplay: boolean;
    /**
     * The font-size for the icon.
     */
    iconSize: number;
    /**
     * Relative to the icon from where the popover for more connection details
     * should display.
     */
    statsPopoverPosition: string;
}
export interface IState extends AbstractState {
    /**
     * Whether popover is visible or not.
     */
    popoverVisible: boolean;
}
declare const styles: (theme: Theme) => {
    container: {
        display: string;
    };
    hidden: {
        display: string;
    };
    icon: {
        padding: string;
        borderRadius: string;
        '&.status-high': {
            backgroundColor: string;
        };
        '&.status-med': {
            backgroundColor: string;
        };
        '&.status-low': {
            backgroundColor: string;
        };
        '&.status-disabled': {
            background: string;
        };
        '&.status-lost': {
            backgroundColor: string;
        };
        '&.status-other': {
            backgroundColor: string;
        };
    };
    inactiveIcon: {
        padding: number;
        borderRadius: string;
    };
};
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState, ownProps: any): {
    _connectionIndicatorInactiveDisabled: boolean;
    _isVirtualScreenshareParticipant: boolean;
    _popoverDisabled: boolean;
    _isConnectionStatusInactive: boolean;
    _isConnectionStatusInterrupted: boolean;
    _videoTrack: ITrack | undefined;
    _autoHideTimeout: number;
};
declare const _default: import("react-redux").ConnectedComponent<React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>, any>;
export default _default;
