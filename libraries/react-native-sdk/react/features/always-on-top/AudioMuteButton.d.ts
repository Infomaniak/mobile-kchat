import { Component } from 'react';
import { IProps } from '../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} state of {@link AudioMuteButton}.
 */
export interface IState {
    /**
     * Whether audio is available is not.
     */
    audioAvailable: boolean;
    /**
     * Whether audio is muted or not.
     */
    audioMuted: boolean;
}
type Props = Partial<IProps>;
/**
 * Stateless "mute/unmute audio" button for the Always-on-Top windows.
 */
export default class AudioMuteButton extends Component<Props, IState> {
    icon: any;
    toggledIcon: any;
    accessibilityLabel: string;
    /**
     * Initializes a new {@code AudioMuteButton} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code AudioMuteButton} instance with.
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
     * Handles audio available api events.
     *
     * @param {{ available: boolean }} status - The new available status.
     * @returns {void}
     */
    _audioAvailabilityListener({ available }: {
        available: boolean;
    }): void;
    /**
     * Handles audio muted api events.
     *
     * @param {{ muted: boolean }} status - The new muted status.
     * @returns {void}
     */
    _audioMutedListener({ muted }: {
        muted: boolean;
    }): void;
    /**
     * Indicates if audio is currently muted or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isAudioMuted(): boolean;
    /**
     * Indicates whether this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled(): boolean;
    /**
     * Changes the muted state.
     *
     * @override
     * @param {boolean} _audioMuted - Whether audio should be muted or not.
     * @protected
     * @returns {void}
     */
    _setAudioMuted(_audioMuted: boolean): void;
    /**
     * Handles clicking / pressing the button, and toggles the audio mute state
     * accordingly.
     *
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
