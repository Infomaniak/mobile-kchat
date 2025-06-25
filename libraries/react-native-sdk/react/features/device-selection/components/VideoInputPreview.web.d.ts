/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link VideoInputPreview}.
 */
export interface IProps {
    /**
     * An error message to display instead of a preview. Displaying an error
     * will take priority over displaying a video preview.
     */
    error: string | null;
    /**
     * Whether or not the local video is flipped.
     */
    localFlipX: boolean;
    /**
     * The JitsiLocalTrack to display.
     */
    track: Object;
}
declare const VideoInputPreview: ({ error, localFlipX, track }: IProps) => JSX.Element;
export default VideoInputPreview;
