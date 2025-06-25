import React from 'react';
import AbstractStopRecordingDialog, { IProps } from '../AbstractStopRecordingDialog';
/**
 * React Component for getting confirmation to stop a file recording session in
 * progress.
 *
 * @augments Component
 */
declare class StopRecordingDialog extends AbstractStopRecordingDialog<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    _onSubmit: () => boolean;
    /**
     * Toggles screenshot capture.
     *
     * @returns {void}
     */
    _toggleScreenshotCapture(): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<StopRecordingDialog> & IProps, "dispatch" | "_conference" | "_displaySubtitles" | "_subtitlesLanguage" | "_fileRecordingSession" | "_localRecording">, keyof import("react-i18next").WithTranslation>>;
export default _default;
