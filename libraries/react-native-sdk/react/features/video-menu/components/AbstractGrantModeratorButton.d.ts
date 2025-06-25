import { IReduxState } from '../../app/types';
import AbstractButton, { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * The ID of the participant for whom to grant moderator status.
     */
    participantID: string;
}
/**
 * An abstract remote video menu button which kicks the remote participant.
 */
export default class AbstractGrantModeratorButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    icon: any;
    label: string;
    /**
   * Handles clicking / pressing the button, and kicks the participant.
   *
   * @private
   * @returns {void}
   */
    _handleClick(): void;
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Object} ownProps - Properties of component.
 * @private
 * @returns {{
 *     visible: boolean
 * }}
 */
export declare function _mapStateToProps(state: IReduxState, ownProps: any): {
    visible: boolean;
};
