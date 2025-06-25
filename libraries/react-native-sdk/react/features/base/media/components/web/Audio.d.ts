/// <reference types="react" />
import AbstractAudio, { IProps } from '../AbstractAudio';
/**
 * The React/Web {@link Component} which is similar to and wraps around
 * {@code HTMLAudioElement} in order to facilitate cross-platform source code.
 */
export default class Audio extends AbstractAudio {
    /**
     * Set to <code>true</code> when the whole file is loaded.
     */
    _audioFileLoaded: boolean;
    /**
     * Reference to the HTML audio element, stored until the file is ready.
     */
    _ref?: HTMLAudioElement | null;
    /**
     * Creates new <code>Audio</code> element instance with given props.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Stops the audio HTML element.
     *
     * @returns {void}
     */
    stop(): void;
    /**
     * If audio element reference has been set and the file has been
     * loaded then {@link setAudioElementImpl} will be called to eventually add
     * the audio to the Redux store.
     *
     * @private
     * @returns {void}
     */
    _maybeSetAudioElementImpl(): void;
    /**
     * Called when 'canplaythrough' event is triggered on the audio element,
     * which means that the whole file has been loaded.
     *
     * @private
     * @returns {void}
     */
    _onCanPlayThrough(): void;
    /**
     * Sets the reference to the HTML audio element.
     *
     * @param {HTMLAudioElement} audioElement - The HTML audio element instance.
     * @private
     * @returns {void}
     */
    _setRef(audioElement?: HTMLAudioElement | null): void;
}
