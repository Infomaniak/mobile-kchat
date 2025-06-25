/// <reference types="react" />
/**
 * React {@code Component} responsible for displaying a label that indicates
 * the displayed video state of the current conference. {@code AudioOnlyLabel}
 * Will display when the conference is in audio only mode. {@code HDVideoLabel}
 * Will display if not in audio only mode and a high-definition large video is
 * being displayed.
 *
 * @returns {JSX}
 */
declare const VideoQualityLabel: () => JSX.Element | null;
export default VideoQualityLabel;
