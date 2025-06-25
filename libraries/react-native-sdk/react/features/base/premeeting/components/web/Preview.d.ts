/// <reference types="react" />
export interface IProps {
    /**
     * Local participant id.
     */
    _participantId: string;
    /**
     * Flag controlling whether the video should be flipped or not.
     */
    flipVideo: boolean;
    /**
     * The name of the user that is about to join.
     */
    name: string;
    /**
     * Flag signaling the visibility of camera preview.
     */
    videoMuted: boolean;
    /**
     * The JitsiLocalTrack to display.
     */
    videoTrack?: Object;
}
/**
 * Component showing the video preview and device status.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactElement}
 */
declare function Preview(props: IProps): JSX.Element;
declare const _default: import("react-redux").ConnectedComponent<typeof Preview, any>;
export default _default;
