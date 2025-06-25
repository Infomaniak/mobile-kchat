/// <reference types="react" />
import { IReduxState } from '../../../app/types';
import { IParticipant } from '../../../base/participants/types';
import { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * True if message is a lobby chat message.
     */
    _isLobbyMessage: boolean;
    /**
     * True if the polls feature is disabled.
     */
    _isPollsDisabled?: boolean;
    /**
     * The participant object retrieved from Redux.
     */
    _participant?: IParticipant;
    /**
     * The ID of the participant that the message is to be sent.
     */
    participantID: string;
    /**
     * True if the button is rendered as a reply button.
     */
    reply: boolean;
}
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState, ownProps: any): {
    _isPollsDisabled: boolean;
    _participant: IParticipant | undefined;
    _isLobbyMessage: any;
    visible: any;
};
declare const _default: import("react").ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
