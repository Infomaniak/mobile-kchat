import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of
 * {@link AbstractStartRecordingDialogContent}.
 */
export interface IProps extends WithTranslation {
    /**
     * Whether the local participant can start transcribing.
     */
    _canStartTranscribing: boolean;
    /**
     * Style of the dialogs feature.
     */
    _dialogStyles: any;
    /**
     * Whether to hide the storage warning or not.
     */
    _hideStorageWarning: boolean;
    /**
     * Whether local participant is moderator.
     */
    _isModerator: boolean;
    /**
     * Whether local recording is available or not.
     */
    _localRecordingAvailable: boolean;
    /**
     * Whether local recording is enabled or not.
     */
    _localRecordingEnabled: boolean;
    /**
     * Whether we won't notify the other participants about the recording.
     */
    _localRecordingNoNotification: boolean;
    /**
     * Whether self local recording is enabled or not.
     */
    _localRecordingSelfEnabled: boolean;
    /**
     * The color-schemed stylesheet of this component.
     */
    _styles: any;
    /**
     * The redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Whether to show file recordings service, even if integrations
     * are enabled.
     */
    fileRecordingsServiceEnabled: boolean;
    /**
     * Whether to show the possibility to share file recording with other people (e.g. Meeting participants), based on
     * the actual implementation on the backend.
     */
    fileRecordingsServiceSharingEnabled: boolean;
    /**
     * If true the content related to the integrations will be shown.
     */
    integrationsEnabled: boolean;
    /**
     * <tt>true</tt> if we have valid oauth token.
     */
    isTokenValid: boolean;
    /**
     * <tt>true</tt> if we are in process of validating the oauth token.
     */
    isValidating: boolean;
    /**
     * Whether or not the current meeting is a vpaas one.
     */
    isVpaas: boolean;
    /**
     * Whether or not we should only record the local streams.
     */
    localRecordingOnlySelf?: boolean;
    /**
     * The function will be called when there are changes related to the
     * switches.
     */
    onChange: Function;
    /**
     * Callback to change the local recording only self setting.
     */
    onLocalRecordingSelfChange?: () => void;
    /**
     * Callback to change the audio and video recording setting.
     */
    onRecordAudioAndVideoChange: Function;
    /**
     * Callback to be invoked on sharing setting change.
     */
    onSharingSettingChanged: () => void;
    /**
     * Callback to change the transcription recording setting.
     */
    onTranscriptionChange: Function;
    /**
     * The currently selected recording service of type: RECORDING_TYPES.
     */
    selectedRecordingService: string | null;
    /**
     * Boolean to set file recording sharing on or off.
     */
    sharingSetting: boolean;
    /**
     * Whether to show the audio and video related content.
     */
    shouldRecordAudioAndVideo: boolean;
    /**
     * Whether to show the transcription related content.
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
export interface IState {
    /**
     * Whether to show the advanced options or not.
     */
    showAdvancedOptions: boolean;
}
/**
 * React Component for getting confirmation to start a recording session.
 *
 * @augments Component
 */
declare class AbstractStartRecordingDialogContent extends Component<IProps, IState> {
    /**
     * Initializes a new {@code AbstractStartRecordingDialogContent} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements the Component's componentDidMount method.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Returns whether the advanced options should be rendered.
     *
     * @returns {boolean}
     */
    _onToggleShowOptions(): void;
    /**
     * Whether the file sharing content should be rendered or not.
     *
     * @returns {boolean}
     */
    _shouldRenderFileSharingContent(): boolean;
    /**
     * Whether the save transcription content should be rendered or not.
     *
     * @returns {boolean}
     */
    _canStartTranscribing(): boolean;
    /**
     * Whether the no integrations content should be rendered or not.
     *
     * @returns {boolean}
     */
    _shouldRenderNoIntegrationsContent(): boolean;
    /**
     * Whether the integrations content should be rendered or not.
     *
     * @returns {boolean}
     */
    _shouldRenderIntegrationsContent(): boolean;
    /**
     * Handler for transcription switch change.
     *
     * @param {boolean} value - The new value.
     * @returns {void}
     */
    _onTranscriptionSwitchChange(value: boolean | undefined): void;
    /**
     * Handler for audio and video switch change.
     *
     * @param {boolean} value - The new value.
     * @returns {void}
     */
    _onRecordAudioAndVideoSwitchChange(value: boolean | undefined): void;
    /**
     * Handler for onValueChange events from the Switch component.
     *
     * @returns {void}
     */
    _onRecordingServiceSwitchChange(): void;
    /**
     * Handler for onValueChange events from the Switch component.
     *
     * @returns {void}
     */
    _onDropboxSwitchChange(): void;
    /**
     * Handler for onValueChange events from the Switch component.
     *
     * @returns {void}
     */
    _onLocalRecordingSwitchChange(): void;
    /**
     * Sings in a user.
     *
     * @returns {void}
     */
    _onSignIn(): void;
    /**
     * Sings out an user from dropbox.
     *
     * @returns {void}
     */
    _onSignOut(): void;
}
/**
 * Maps part of the redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
export declare function mapStateToProps(state: IReduxState): {
    isVpaas: boolean;
    _canStartTranscribing: boolean;
    _hideStorageWarning: boolean;
    _isModerator: boolean;
    _localRecordingAvailable: any;
    _localRecordingEnabled: boolean;
    _localRecordingSelfEnabled: boolean;
    _localRecordingNoNotification: boolean;
    _styles: import("../../../base/styles/functions.any").StyleType;
    _dialogStyles: import("../../../base/styles/functions.any").StyleType;
};
export default AbstractStartRecordingDialogContent;
