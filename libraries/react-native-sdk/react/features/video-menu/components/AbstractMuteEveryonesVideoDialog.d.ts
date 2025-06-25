import { IReduxState } from '../../app/types';
import AbstractMuteRemoteParticipantsVideoDialog, { type IProps as AbstractProps } from './AbstractMuteRemoteParticipantsVideoDialog';
/**
 * The type of the React {@code Component} props of
 * {@link AbstractMuteEveryonesVideoDialog}.
 */
export interface IProps extends AbstractProps {
    content?: string;
    exclude: Array<string>;
    isModerationSupported?: boolean;
    isVideoModerationEnabled?: boolean;
    showAdvancedModerationToggle: boolean;
    title: string;
}
export interface IState {
    content: string;
    moderationEnabled?: boolean;
}
/**
 *
 * An abstract Component with the contents for a dialog that asks for confirmation
 * from the user before disabling all remote participants cameras.
 *
 * @augments AbstractMuteRemoteParticipantsVideoDialog
 */
export default class AbstractMuteEveryonesVideoDialog<P extends IProps> extends AbstractMuteRemoteParticipantsVideoDialog<P, IState> {
    static defaultProps: {
        exclude: never[];
        muteLocal: boolean;
    };
    /**
     * Initializes a new {@code AbstractMuteRemoteParticipantsVideoDialog} instance.
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
 * Maps (parts of) the Redux state to the associated {@code AbstractMuteEveryonesVideoDialog}'s props.
 *
 * @param {IReduxState} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component.
 * @returns {IProps}
 */
export declare function abstractMapStateToProps(state: IReduxState, ownProps: IProps): {
    content: string;
    title: string;
    isVideoModerationEnabled?: undefined;
    isModerationSupported?: undefined;
} | {
    title: string;
    isVideoModerationEnabled: boolean;
    isModerationSupported: boolean;
    content?: undefined;
};
