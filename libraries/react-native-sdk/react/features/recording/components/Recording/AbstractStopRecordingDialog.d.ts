import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../../app/types';
import { IJitsiConference } from '../../../base/conference/reducer';
import { ISessionData } from '../../reducer';
/**
 * The type of the React {@code Component} props of
 * {@link AbstractStopRecordingDialog}.
 */
export interface IProps extends WithTranslation {
    /**
     * The {@code JitsiConference} for the current conference.
     */
    _conference?: IJitsiConference;
    /**
     * Whether subtitles should be displayed or not.
     */
    _displaySubtitles?: boolean;
    /**
     * The redux representation of the recording session to be stopped.
     */
    _fileRecordingSession?: ISessionData;
    /**
     * Whether the recording is a local recording or not.
     */
    _localRecording: boolean;
    /**
     * The selected language for subtitles.
     */
    _subtitlesLanguage: string | null;
    /**
     * The redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The user trying to stop the video while local recording is running.
     */
    localRecordingVideoStop?: boolean;
}
/**
 * Abstract React Component for getting confirmation to stop a file recording
 * session in progress.
 *
 * @augments Component
 */
export default class AbstractStopRecordingDialog<P extends IProps> extends Component<P> {
    /**
     * Initializes a new {@code AbstrStopRecordingDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props: P);
    /**
     * Stops the recording session.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit(): boolean;
    /**
     * Toggles screenshot capture feature.
     *
     * @returns {void}
     */
    _toggleScreenshotCapture(): void;
}
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code StopRecordingDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _conference: IJitsiConference | undefined;
    _displaySubtitles: boolean;
    _fileRecordingSession: ISessionData | undefined;
    _localRecording: boolean;
    _subtitlesLanguage: string | null;
};
