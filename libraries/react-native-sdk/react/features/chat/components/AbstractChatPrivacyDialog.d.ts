import { PureComponent } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../app/types';
import { IParticipant } from '../../base/participants/types';
export interface IProps extends WithTranslation {
    /**
     * Prop to be invoked on sending the message.
     */
    _onSendMessage: Function;
    /**
     * Prop to be invoked when the user wants to set a private recipient.
     */
    _onSetMessageRecipient: Function;
    /**
     * The participant retrieved from Redux by the participantID prop.
     */
    _participant?: IParticipant;
    /**
     * The message that is about to be sent.
     */
    message: Object;
    /**
     * The ID of the participant that we think the message may be intended to.
     */
    participantID: string;
}
/**
 * Abstract class for the dialog displayed to avoid mis-sending private messages.
 */
export declare class AbstractChatPrivacyDialog extends PureComponent<IProps> {
    /**
     * Instantiates a new instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Callback to be invoked for cancel action (user wants to send a group message).
     *
     * @returns {boolean}
     */
    _onSendGroupMessage(): boolean;
    /**
     * Callback to be invoked for submit action (user wants to send a private message).
     *
     * @returns {void}
     */
    _onSendPrivateMessage(): boolean;
}
/**
 * Maps part of the props of this component to Redux actions.
 *
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {IProps}
 */
export declare function _mapDispatchToProps(dispatch: IStore['dispatch']): {
    _onSendMessage: (message: string) => void;
    _onSetMessageRecipient: (participant: IParticipant) => void;
};
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {IReduxState} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState, ownProps: IProps): {
    _participant: IParticipant | undefined;
};
