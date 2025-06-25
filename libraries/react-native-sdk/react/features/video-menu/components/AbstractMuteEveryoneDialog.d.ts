import { IReduxState } from '../../app/types';
import AbstractMuteRemoteParticipantDialog, { type IProps as AbstractProps } from './AbstractMuteRemoteParticipantDialog';
/**
 * The type of the React {@code Component} props of
 * {@link AbstractMuteEveryoneDialog}.
 */
export interface IProps extends AbstractProps {
    content?: string;
    exclude: Array<string>;
    isAudioModerationEnabled?: boolean;
    isModerationSupported?: boolean;
    showAdvancedModerationToggle: boolean;
    title: string;
}
export interface IState {
    audioModerationEnabled?: boolean;
    content: string;
}
/**
 *
 * An abstract Component with the contents for a dialog that asks for confirmation
 * from the user before muting all remote participants.
 *
 * @augments AbstractMuteRemoteParticipantDialog
 */
export default class AbstractMuteEveryoneDialog<P extends IProps> extends AbstractMuteRemoteParticipantDialog<P, IState> {
    static defaultProps: {
        exclude: never[];
        muteLocal: boolean;
    };
    /**
     * Initializes a new {@code AbstractMuteRemoteParticipantDialog} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: P);
    /**
      * Toggles advanced moderation switch.
      *
      * @returns {void}
      */
    _onToggleModeration(): void;
    /**
     * Callback to be invoked when the value of this dialog is submitted.
     *
     * @returns {boolean}
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
    content: string;
    title: string;
    isAudioModerationEnabled?: undefined;
    isModerationSupported?: undefined;
} | {
    title: string;
    isAudioModerationEnabled: boolean;
    isModerationSupported: boolean;
    content?: undefined;
};
