import { Component } from 'react';
import { IProps } from '../base/toolbox/components/AbstractButton';
type Props = Partial<IProps>;
/**
 * The type of the React {@code Component} state of {@link VideoMuteButton}.
 */
type State = {
    /**
     * Whether video is available is not.
     */
    videoAvailable: boolean;
    /**
     * Whether video is muted or not.
     */
    videoMuted: boolean;
};
/**
 * Stateless "mute/unmute video" button for the Always-on-Top windows.
 */
export default class VideoMuteButton extends Component<Props, State> {
    icon: any;
    toggledIcon: any;
    accessibilityLabel: string;
    /**
     * Initializes a new {@code VideoMuteButton} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code VideoMuteButton} instance with.
     */
    constructor(props: Props);
    /**
     * Sets mouse move listener and initial toolbar timeout.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Removes all listeners.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount(): void;
    /**
     * Indicates whether this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled(): boolean;
    /**
     * Indicates if video is currently muted or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isVideoMuted(): boolean;
    /**
     * Changes the muted state.
     *
     * @override
     * @param {boolean} _videoMuted - Whether video should be muted or not.
     * @protected
     * @returns {void}
     */
    _setVideoMuted(_videoMuted: boolean): void;
    /**
     * Handles video available api events.
     *
     * @param {{ available: boolean }} status - The new available status.
     * @returns {void}
     */
    _videoAvailabilityListener({ available }: {
        available: boolean;
    }): void;
    /**
     * Handles video muted api events.
     *
     * @param {{ muted: boolean }} status - The new muted status.
     * @returns {void}
     */
    _videoMutedListener({ muted }: {
        muted: boolean;
    }): void;
    /**
     * Handles clicking / pressing the button, and toggles the video mute state
     * accordingly.
     *
     * @protected
     * @returns {void}
     */
    _onClick(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
export {};
