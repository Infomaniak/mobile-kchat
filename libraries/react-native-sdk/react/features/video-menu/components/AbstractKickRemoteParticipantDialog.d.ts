import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
export interface IProps extends WithTranslation {
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The ID of the remote participant to be kicked.
     */
    participantID: string;
}
/**
 * Abstract dialog to confirm a remote participant kick action.
 */
export default class AbstractKickRemoteParticipantDialog extends Component<IProps> {
    /**
     * Initializes a new {@code AbstractKickRemoteParticipantDialog} instance.
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
