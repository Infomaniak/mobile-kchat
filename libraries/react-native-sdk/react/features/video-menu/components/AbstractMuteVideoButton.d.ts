import { IReduxState } from '../../app/types';
import AbstractButton, { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * Boolean to indicate if the video track of the participant is muted or
     * not.
     */
    _videoTrackMuted: boolean;
    /**
     * The ID of the participant object that this button is supposed to
     * mute/unmute.
     */
    participantID: string;
}
/**
 * An abstract remote video menu button which mutes the remote participant.
 */
export default class AbstractMuteVideoButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    icon: any;
    label: string;
    toggledLabel: string;
    /**
     * Handles clicking / pressing the button, and mutes the participant.
     *
     * @private
     * @returns {void}
     */
    _handleClick(): void;
    /**
     * Renders the item disabled if the participant is muted.
     *
     * @inheritdoc
     */
    _isDisabled(): boolean;
    /**
     * Renders the item toggled if the participant is muted.
     *
     * @inheritdoc
     */
    _isToggled(): boolean;
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Object} ownProps - Properties of component.
 * @private
 * @returns {{
 *      _videoTrackMuted: boolean
 *  }}
 */
export declare function _mapStateToProps(state: IReduxState, ownProps: any): {
    _videoTrackMuted: boolean;
};
