import AbstractButton, { IProps } from './AbstractButton';
/**
 * An abstract implementation of a button for toggling audio mute.
 */
export default class BaseAudioMuteButton<P extends IProps, S = any> extends AbstractButton<P, S> {
    icon: any;
    toggledIcon: any;
    /**
     * Handles clicking / pressing the button, and toggles the audio mute state
     * accordingly.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick(): void;
    /**
     * Helper function to be implemented by subclasses, which must return a
     * boolean value indicating if audio is muted or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isAudioMuted(): boolean;
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled(): boolean;
    /**
     * Helper function to perform the actual setting of the audio mute / unmute
     * action.
     *
     * @param {boolean} _audioMuted - Whether audio should be muted or not.
     * @protected
     * @returns {void}
     */
    _setAudioMuted(_audioMuted: boolean): void;
}
