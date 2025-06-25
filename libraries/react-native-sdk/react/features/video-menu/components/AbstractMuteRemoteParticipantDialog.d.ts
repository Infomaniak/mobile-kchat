import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
/**
 * The type of the React {@code Component} props of
 * {@link AbstractMuteRemoteParticipantDialog}.
 */
export interface IProps extends WithTranslation {
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The ID of the remote participant to be muted.
     */
    participantID: string;
}
/**
 * Abstract dialog to confirm a remote participant mute action.
 *
 * @augments Component
 */
export default class AbstractMuteRemoteParticipantDialog<P extends IProps = IProps, State = void> extends Component<P, State> {
    /**
     * Initializes a new {@code AbstractMuteRemoteParticipantDialog} instance.
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
