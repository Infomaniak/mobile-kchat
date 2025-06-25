import { IReduxState } from '../../app/types';
import { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
import BaseAudioMuteButton from '../../base/toolbox/components/BaseAudioMuteButton';
/**
 * The type of the React {@code Component} props of {@link AbstractAudioMuteButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether audio is currently muted or not.
    */
    _audioMuted: boolean;
    /**
     * Whether the button is disabled.
    */
    _disabled: boolean;
}
/**
 * Component that renders a toolbar button for toggling audio mute.
 *
 * @augments BaseAudioMuteButton
 */
export default class AbstractAudioMuteButton<P extends IProps> extends BaseAudioMuteButton<P> {
    accessibilityLabel: string;
    toggledAccessibilityLabel: string;
    label: string;
    toggledLabel: string;
    tooltip: string;
    toggledTooltip: string;
    /**
     * Indicates if audio is currently muted or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isAudioMuted(): P["_audioMuted"];
    /**
     * Changes the muted state.
     *
     * @param {boolean} audioMuted - Whether audio should be muted or not.
     * @protected
     * @returns {void}
     */
    _setAudioMuted(audioMuted: boolean): void;
    /**
     * Return a boolean value indicating if this button is disabled or not.
     *
     * @returns {boolean}
     */
    _isDisabled(): P["_disabled"];
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code AbstractAudioMuteButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _audioMuted: boolean,
 *     _disabled: boolean
 * }}
 */
export declare function mapStateToProps(state: IReduxState): {
    _audioMuted: boolean;
    _disabled: boolean;
    visible: any;
};
