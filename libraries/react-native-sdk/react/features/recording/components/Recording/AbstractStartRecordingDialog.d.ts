import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../../app/types';
import { IJitsiConference } from '../../../base/conference/reducer';
export interface IProps extends WithTranslation {
    /**
     * The app key for the dropbox authentication.
     */
    _appKey: string;
    /**
     * Requests transcribing when recording is turned on.
     */
    _autoTranscribeOnRecord: boolean;
    /**
     * The {@code JitsiConference} for the current conference.
     */
    _conference?: IJitsiConference;
    /**
     * Whether subtitles should be displayed or not.
     */
    _displaySubtitles?: boolean;
    /**
     * Whether to show file recordings service, even if integrations
     * are enabled.
     */
    _fileRecordingsServiceEnabled: boolean;
    /**
     * Whether to show the possibility to share file recording with other people (e.g. Meeting participants), based on
     * the actual implementation on the backend.
     */
    _fileRecordingsServiceSharingEnabled: boolean;
    /**
     * If true the dropbox integration is enabled, otherwise - disabled.
     */
    _isDropboxEnabled: boolean;
    /**
     * Whether or not local recording is enabled.
     */
    _localRecordingEnabled: boolean;
    /**
     * The dropbox refresh token.
     */
    _rToken: string;
    /**
     * Whether the record audio / video option is enabled by default.
     */
    _recordAudioAndVideo: boolean;
    /**
     * Whether or not the local participant is screensharing.
     */
    _screensharing: boolean;
    /**
     * Whether or not the screenshot capture feature is enabled.
     */
    _screenshotCaptureEnabled: boolean;
    /**
     * The selected language for subtitles.
     */
    _subtitlesLanguage: string | null;
    /**
     * The dropbox access token.
     */
    _token: string;
    /**
     * Access token's expiration date as UNIX timestamp.
     */
    _tokenExpireDate?: number;
    /**
     * The redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    navigation: any;
}
export interface IState {
    /**
     * <tt>true</tt> if we have valid oauth token.
     */
    isTokenValid: boolean;
    /**
     * <tt>true</tt> if we are in process of validating the oauth token.
     */
    isValidating: boolean;
    /**
     * Whether the local recording should record just the local user streams.
     */
    localRecordingOnlySelf: boolean;
    /**
     * The currently selected recording service of type: RECORDING_TYPES.
     */
    selectedRecordingService: string;
    /**
     * True if the user requested the service to share the recording with others.
     */
    sharingEnabled: boolean;
    /**
     * True if the user requested the service to record audio and video.
     */
    shouldRecordAudioAndVideo: boolean;
    /**
     * True if the user requested the service to record transcription.
     */
    shouldRecordTranscription: boolean;
    /**
     * Number of MiB of available space in user's Dropbox account.
     */
    spaceLeft?: number;
    /**
     * The display name of the user's Dropbox account.
     */
    userName?: string;
}
/**
 * Component for the recording start dialog.
 */
declare class AbstractStartRecordingDialog extends Component<IProps, IState> {
    /**
     * Initializes a new {@code StartRecordingDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Validates the oauth access token.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Validates the oauth access token.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Returns true if the integrations with third party services are enabled
     * and false otherwise.
     *
     * @returns {boolean} - True if the integrations with third party services
     * are enabled and false otherwise.
     */
    _areIntegrationsEnabled(): boolean;
    /**
     * Callback to handle sharing setting change from the dialog.
     *
     * @returns {void}
     */
    _onSharingSettingChanged(): void;
    /**
     * Callback to handle local recording only self setting change.
     *
     * @returns {void}
     */
    _onLocalRecordingSelfChange(): void;
    /**
     * Handles selected recording service changes.
     *
     * @param {string} selectedRecordingService - The new selected recording
     * service.
     * @returns {void}
     */
    _onSelectedRecordingServiceChanged(selectedRecordingService: string): void;
    /**
     * Handles transcription switch change.
     *
     * @param {boolean} value - The new value.
     * @returns {void}
     */
    _onTranscriptionChange(value: boolean): void;
    /**
     * Handles audio and video switch change.
     *
     * @param {boolean} value - The new value.
     * @returns {void}
     */
    _onRecordAudioAndVideoChange(value: boolean): void;
    /**
     * Validates the dropbox access token and fetches account information.
     *
     * @returns {void}
     */
    _onTokenUpdated(): void;
    /**
     * Starts a file recording session.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit(): true | undefined;
    /**
     * Toggles screenshot capture feature.
     *
     * @returns {void}
     */
    _toggleScreenshotCapture(): void;
    /**
     * Renders the platform specific dialog content.
     *
     * @protected
     * @returns {React$Component}
     */
    _renderDialogContent: () => React.Component;
}
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code StartRecordingDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @param {any} _ownProps - Component's own props.
 * @private
 * @returns {IProps}
 */
export declare function mapStateToProps(state: IReduxState, _ownProps: any): {
    _appKey: string;
    _autoTranscribeOnRecord: boolean;
    _conference: IJitsiConference | undefined;
    _displaySubtitles: boolean;
    _fileRecordingsServiceEnabled: boolean;
    _fileRecordingsServiceSharingEnabled: boolean;
    _isDropboxEnabled: boolean;
    _localRecordingEnabled: boolean;
    _rToken: string;
    _recordAudioAndVideo: boolean;
    _subtitlesLanguage: string | null;
    _tokenExpireDate: number | undefined;
    _token: string;
};
export default AbstractStartRecordingDialog;
