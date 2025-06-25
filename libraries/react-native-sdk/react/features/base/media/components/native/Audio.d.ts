import Sound from 'react-native-sound';
import AbstractAudio, { IProps } from '../AbstractAudio';
/**
 * The React Native/mobile {@link Component} which is similar to Web's
 * {@code HTMLAudioElement} and wraps around react-native-webrtc's
 * {@link RTCView}.
 */
export default class Audio extends AbstractAudio {
    /**
     * Reference to 'react-native-sound} {@link Sound} instance.
     */
    _sound: Sound | undefined | null;
    /**
     * A callback passed to the 'react-native-sound''s {@link Sound} instance,
     * called when loading sound is finished.
     *
     * @param {Object} error - The error object passed by
     * the 'react-native-sound' library.
     * @returns {void}
     * @private
     */
    _soundLoadedCallback(error: Error): void;
    /**
     * Implements React's {@link Component#componentDidUpdate()}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps): Promise<void>;
    /**
     * Will load the sound, after the component did mount.
     *
     * @returns {void}
     */
    componentDidMount(): Promise<void>;
    /**
     * Will dispose sound resources (if any) when component is about to unmount.
     *
     * @returns {void}
     */
    componentWillUnmount(): Promise<void>;
    /**
     * Attempts to begin the playback of the media.
     *
     * @inheritdoc
     * @override
     */
    play(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {null}
     */
    render(): null;
    /**
     * Stops the sound if it's currently playing.
     *
     * @returns {void}
     */
    stop(): void;
}
