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
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<StopRecordingDialog> & IProps, "dispatch" | "_conference" | "_displaySubtitles" | "_fileRecordingSession" | "_localRecording" | "_subtitlesLanguage">, keyof import("react-i18next").WithTranslation>>;
export default _default;
