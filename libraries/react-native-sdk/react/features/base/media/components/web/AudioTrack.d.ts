import React, { Component } from 'react';
import { ITrack } from '../../../tracks/types';
/**
 * The type of the React {@code Component} props of {@link AudioTrack}.
 */
export interface IProps {
    /**
     * Represents muted property of the underlying audio element.
     */
    _muted?: boolean;
    /**
     * Represents volume property of the underlying audio element.
     */
    _volume?: number | boolean;
    /**
     * The audio track.
     */
    audioTrack?: ITrack;
    /**
     * Used to determine the value of the autoplay attribute of the underlying
     * audio element.
     */
    autoPlay: boolean;
    /**
     * The value of the id attribute of the audio element.
     */
    id: string;
    /**
     * The ID of the participant associated with the audio element.
     */
    participantId: string;
}
/**
 * The React/Web {@link Component} which is similar to and wraps around {@code HTMLAudioElement}.
 */
declare class AudioTrack extends Component<IProps> {
    /**
     * Reference to the HTML audio element, stored until the file is ready.
     */
    _ref: React.RefObject<HTMLAudioElement>;
    /**
     * The current timeout ID for play() retries.
     */
    _playTimeout: number | undefined;
    /**
     * Default values for {@code AudioTrack} component's properties.
     *
     * @static
     */
    static defaultProps: {
        autoPlay: boolean;
        id: string;
    };
    /**
     * Creates new <code>Audio</code> element instance with given props.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Attaches the audio track to the audio element and plays it.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Remove any existing associations between the current audio track and the
     * component's audio element.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount(): void;
    /**
     * This component's updating is blackboxed from React to prevent re-rendering of the audio
     * element, as we set all the properties manually.
     *
     * @inheritdoc
     * @returns {boolean} - False is always returned to blackbox this component
     * from React.
     */
    shouldComponentUpdate(nextProps: IProps): boolean;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Calls into the passed in track to associate the track with the component's audio element.
     *
     * @param {Object} track - The redux representation of the {@code JitsiLocalTrack}.
     * @private
     * @returns {void}
     */
    _attachTrack(track?: ITrack): void;
    /**
     * Removes the association to the component's audio element from the passed
     * in redux representation of jitsi audio track.
     *
     * @param {Object} track -  The redux representation of the {@code JitsiLocalTrack}.
     * @private
     * @returns {void}
     */
    _detachTrack(track?: ITrack): void;
    /**
     * Reattaches the audio track to the underlying HTMLAudioElement when an 'error' event is fired.
     *
     * @param {Error} error - The error event fired on the HTMLAudioElement.
     * @returns {void}
     */
    _errorHandler(error: Error): void;
    /**
     * Plays the underlying HTMLAudioElement.
     *
     * @param {number} retries - The number of previously failed retries.
     * @returns {void}
     */
    _play(retries?: number): void;
}
declare const _default: import("react-redux").ConnectedComponent<typeof AudioTrack, any>;
export default _default;
