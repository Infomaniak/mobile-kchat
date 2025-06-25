import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../app/types';
/**
 * The type of the React {@code Component} props of
 * {@link AbstractMuteRemoteParticipantsVideoDialog}.
 */
export interface IProps extends WithTranslation {
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Whether or not video moderation is on.
     */
    isVideoModerationOn: boolean;
    /**
     * The ID of the remote participant to be muted.
     */
    participantID: string;
}
/**
 * Abstract dialog to confirm a remote participant video ute action.
 *
 * @augments Component
 */
export default class AbstractMuteRemoteParticipantsVideoDialog<P extends IProps = IProps, State = any> extends Component<P, State> {
    /**
     * Initializes a new {@code AbstractMuteRemoteParticipantsVideoDialog} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: P);
    /**
     * Handles the submit button action.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit(): boolean;
}
/**
 * Maps (parts of) the redux state to the associated
 * {@code AbstractDialogContainer}'s props.
 *
 * @param {IReduxState} state - The redux state.
 * @private
 * @returns {Object}
 */
export declare function abstractMapStateToProps(state: IReduxState): {
    isVideoModerationOn: boolean;
};
