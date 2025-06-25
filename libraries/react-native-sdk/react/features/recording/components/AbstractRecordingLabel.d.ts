import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState } from '../../app/types';
export interface IProps extends WithTranslation {
    /**
     * Whether this is the Jibri recorder participant.
     */
    _iAmRecorder: boolean;
    /**
     * Whether this meeting is being transcribed.
    */
    _isTranscribing: boolean;
    /**
     * Whether the recording/livestreaming/transcriber is currently running.
     */
    _isVisible: boolean;
    /**
     * The status of the higher priority session.
     */
    _status?: string;
    /**
     * The recording mode this indicator should display.
     */
    mode: string;
}
/**
 * Abstract class for the {@code RecordingLabel} component.
 */
export default class AbstractRecordingLabel<P extends IProps = IProps> extends Component<P> {
    /**
     * Implements React {@code Component}'s render.
     *
     * @inheritdoc
     */
    render(): React.ReactNode;
    /**
     * Renders the platform specific label component.
     *
     * @protected
     * @returns {React$Element}
     */
    _renderLabel(): React.ReactNode | null;
}
/**
 * Maps (parts of) the Redux state to the associated
 * {@code AbstractRecordingLabel}'s props.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The component's own props.
 * @private
 * @returns {{
 *     _status: ?string
 * }}
 */
export declare function _mapStateToProps(state: IReduxState, ownProps: any): {
    _isVisible: boolean;
    _iAmRecorder: boolean;
    _isTranscribing: boolean;
    _status: string | undefined;
};
