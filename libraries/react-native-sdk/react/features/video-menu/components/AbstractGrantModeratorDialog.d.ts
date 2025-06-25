import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../app/types';
export interface IProps extends WithTranslation {
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The ID of the remote participant to be granted moderator rights.
     */
    participantID: string;
    /**
     * The name of the remote participant to be granted moderator rights.
     */
    participantName?: string;
}
/**
 * Abstract dialog to confirm granting moderator to a participant.
 */
export default class AbstractGrantModeratorDialog extends Component<IProps> {
    /**
     * Initializes a new {@code AbstractGrantModeratorDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Callback for the confirm button.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit(): boolean;
}
/**
 * Maps (parts of) the Redux state to the associated {@code AbstractMuteEveryoneDialog}'s props.
 *
 * @param {IReduxState} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component.
 * @returns {IProps}
 */
export declare function abstractMapStateToProps(state: IReduxState, ownProps: IProps): {
    participantName: string | undefined;
};
