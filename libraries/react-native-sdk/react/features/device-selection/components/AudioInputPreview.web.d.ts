/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link AudioInputPreview}.
 */
export interface IProps {
    /**
     * The JitsiLocalTrack to show an audio level meter for.
     */
    track: any;
}
declare const AudioInputPreview: (props: IProps) => JSX.Element;
export default AudioInputPreview;
