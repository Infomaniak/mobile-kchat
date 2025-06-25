import React from 'react';
import AbstractStartRecordingDialogContent from '../AbstractStartRecordingDialogContent';
/**
 * The start recording dialog content for the mobile application.
 */
declare class StartRecordingDialogContent extends AbstractStartRecordingDialogContent {
    /**
     * Renders the component.
     *
     * @protected
     * @returns {React$Component}
     */
    render(): JSX.Element;
    /**
     * Renders the switch for saving the transcription.
     *
     * @returns {React$Component}
     */
    _renderAdvancedOptions(): JSX.Element | null;
    /**
     * Renders the content in case no integrations were enabled.
     *
     * @returns {React$Component}
     */
    _renderNoIntegrationsContent(): JSX.Element | null;
    /**
     * Renders the file recording service sharing options, if enabled.
     *
     * @returns {React$Component}
     */
    _renderFileSharingContent(): JSX.Element | null;
    /**
     * Renders the info in case recording is uploaded to the cloud.
     *
     * @returns {React$Component}
     */
    _renderUploadToTheCloudInfo(): JSX.Element | null;
    /**
     * Renders a spinner component.
     *
     * @returns {React$Component}
     */
    _renderSpinner(): JSX.Element;
    /**
     * Renders the screen with the account information of a logged in user.
     *
     * @returns {React$Component}
     */
    _renderSignOut(): JSX.Element;
    /**
     * Renders the content in case integrations were enabled.
     *
     * @protected
     * @returns {React$Component}
     */
    _renderIntegrationsContent(): JSX.Element | null;
    /**
     * Renders the content for local recordings.
     *
     * @protected
     * @returns {React$Component}
     */
    _renderLocalRecordingContent(): JSX.Element | null;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<StartRecordingDialogContent> & import("../AbstractStartRecordingDialogContent").IProps, "dispatch" | "_localRecordingEnabled" | "_canStartTranscribing" | "_dialogStyles" | "_hideStorageWarning" | "_isModerator" | "_localRecordingAvailable" | "_localRecordingNoNotification" | "_localRecordingSelfEnabled" | "_styles" | "isVpaas">, keyof import("react-i18next").WithTranslation>>;
export default _default;
