import { IReduxState } from '../../app/types';
import { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
import BaseVideoMuteButton from '../../base/toolbox/components/BaseVideoMuteButton';
/**
 * The type of the React {@code Component} props of {@link AbstractVideoMuteButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether video button is disabled or not.
     */
    _videoDisabled: boolean;
    /**
     * Whether video is currently muted or not.
     */
    _videoMuted: boolean;
}
/**
 * Component that renders a toolbar button for toggling video mute.
 *
 * @augments BaseVideoMuteButton
 */
export default class AbstractVideoMuteButton<P extends IProps> extends BaseVideoMuteButton<P> {
    accessibilityLabel: string;
    toggledAccessibilityLabel: string;
    label: string;
    toggledLabel: string;
    tooltip: string;
    toggledTooltip: string;
    /**
     * Indicates if video is currently disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled(): P["_videoDisabled"];
    /**
     * Indicates if video is currently muted or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isVideoMuted(): P["_videoMuted"];
    /**
     * Changes the muted state.
     *
     * @override
     * @param {boolean} videoMuted - Whether video should be muted or not.
     * @protected
     * @returns {void}
     */
    _setVideoMuted(videoMuted: boolean): void;
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code VideoMuteButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _videoMuted: boolean
 * }}
 */
export declare function mapStateToProps(state: IReduxState): {
    _videoDisabled: boolean;
    _videoMuted: boolean;
    visible: any;
};
