import { PureComponent } from 'react';
import { IReduxState, IStore } from '../../app/types';
import { IJitsiConference } from '../../base/conference/reducer';
import { IMessage } from '../../chat/types';
export declare const SCREEN_STATES: {
    EDIT: number;
    PASSWORD: number;
    VIEW: number;
};
export interface IProps {
    /**
     * Indicates whether the device status should be visible.
     */
    _deviceStatusVisible: boolean;
    /**
     * Indicates whether the message that display name is required is shown.
     */
    _isDisplayNameRequiredActive: boolean;
    /**
     * True if moderator initiated a chat session with the participant.
     */
    _isLobbyChatActive: boolean;
    /**
     * True if knocking is already happening, so we're waiting for a response.
     */
    _knocking: boolean;
    /**
    * Lobby messages between moderator and the participant.
    */
    _lobbyChatMessages: IMessage[];
    /**
     * Name of the lobby chat recipient.
     */
    _lobbyMessageRecipient?: string;
    /**
     * The name of the meeting we're about to join.
     */
    _meetingName: string;
    /**
     * The members only conference if any,.
     */
    _membersOnlyConference?: IJitsiConference;
    /**
     * The email of the participant about to knock/join.
     */
    _participantEmail?: string;
    /**
     * The id of the participant about to knock/join. This is the participant ID in the lobby room, at this point.
     */
    _participantId?: string;
    /**
     * The name of the participant about to knock/join.
     */
    _participantName?: string;
    /**
     * True if a recent attempt to join with password failed.
     */
    _passwordJoinFailed: boolean;
    /**
     * True if the password field should be available for lobby participants.
     */
    _renderPassword: boolean;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Indicates whether the copy url button should be shown.
     */
    showCopyUrlButton: boolean;
    /**
     * Function to be used to translate i18n labels.
     */
    t: Function;
}
export interface IState {
    /**
     * The display name value entered into the field.
     */
    displayName: string;
    /**
     * The email value entered into the field.
     */
    email: string;
    /**
     * True if lobby chat widget is open.
     */
    isChatOpen: boolean;
    /**
     * The password value entered into the field.
     */
    password: string;
    /**
     * True if a recent attempt to join with password failed.
     */
    passwordJoinFailed: boolean;
    /**
     * The state of the screen. One of {@code SCREEN_STATES[*]}.
     */
    screenState: number;
}
/**
 * Abstract class to encapsulate the platform common code of the {@code LobbyScreen}.
 */
export default class AbstractLobbyScreen<P extends IProps = IProps> extends PureComponent<P, IState> {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props: P);
    /**
     * Implements {@code PureComponent.getDerivedStateFromProps}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props: IProps, state: IState): {
        password: string;
        passwordJoinFailed: boolean;
    } | null;
    /**
     * Returns the screen title.
     *
     * @returns {string}
     */
    _getScreenTitleKey(): "lobby.lobbyChatStartedTitle" | "lobby.joiningTitle" | "lobby.enterPasswordTitle" | "lobby.joinTitle";
    /**
     * Callback to be invoked when the user submits the joining request.
     *
     * @returns {void}
     */
    _onAskToJoin(): boolean;
    /**
     * Callback to be invoked when the user cancels the dialog.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel(): boolean;
    /**
     * Callback to be invoked when the user changes its display name.
     *
     * @param {SyntheticEvent} event - The SyntheticEvent instance of the change.
     * @returns {void}
     */
    _onChangeDisplayName(event: {
        target: {
            value: string;
        };
    } | string): void;
    /**
     * Callback to be invoked when the user changes its email.
     *
     * @param {SyntheticEvent} event - The SyntheticEvent instance of the change.
     * @returns {void}
     */
    _onChangeEmail(event: {
        target: {
            value: string;
        };
    } | string): void;
    /**
     * Callback to be invoked when the user changes the password.
     *
     * @param {SyntheticEvent} event - The SyntheticEvent instance of the change.
     * @returns {void}
     */
    _onChangePassword(event: {
        target: {
            value: string;
        };
    } | string): void;
    /**
     * Callback to be invoked for the edit button.
     *
     * @returns {void}
     */
    _onEnableEdit(): void;
    /**
     * Callback to be invoked when the user tries to join using a preset password.
     *
     * @returns {void}
     */
    _onJoinWithPassword(): void;
    /**
     * Callback to be invoked for sending lobby chat messages.
     *
     * @param {string} message - Message to be sent.
     * @returns {void}
     */
    _onSendMessage(message: string): void;
    /**
     * Callback to be invoked for the enter (go back to) knocking mode button.
     *
     * @returns {void}
     */
    _onSwitchToKnockMode(): void;
    /**
     * Callback to be invoked for the enter password button.
     *
     * @returns {void}
     */
    _onSwitchToPasswordMode(): void;
    /**
     * Callback to be invoked for toggling lobby chat visibility.
     *
     * @returns {void}
     */
    _onToggleChat(): void;
    /**
     * Renders the content of the dialog.
     *
     * @returns {React$Element}
     */
    _renderContent(): JSX.Element;
    /**
     * Renders the joining (waiting) fragment of the screen.
     *
     * @returns {React$Element}
     */
    _renderJoining(): JSX.Element;
    /**
     * Renders the participant form to let the knocking participant enter its details.
     *
     * @returns {React$Element}
     */
    _renderParticipantForm(): JSX.Element;
    /**
     * Renders the participant info fragment when we have all the required details of the user.
     *
     * @returns {React$Element}
     */
    _renderParticipantInfo(): JSX.Element;
    /**
     * Renders the password form to let the participant join by using a password instead of knocking.
     *
     * @returns {React$Element}
     */
    _renderPasswordForm(): JSX.Element;
    /**
     * Renders the password join button (set).
     *
     * @returns {React$Element}
     */
    _renderPasswordJoinButtons(): JSX.Element;
    /**
     * Renders the standard (pre-knocking) button set.
     *
     * @returns {React$Element}
     */
    _renderStandardButtons(): JSX.Element;
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _deviceStatusVisible: boolean;
    _isDisplayNameRequiredActive: boolean;
    _knocking: boolean;
    _lobbyChatMessages: IMessage[];
    _lobbyMessageRecipient: string | undefined;
    _isLobbyChatActive: boolean;
    _meetingName: string;
    _membersOnlyConference: IJitsiConference | undefined;
    _participantEmail: string | undefined;
    _participantId: string | undefined;
    _participantName: string | undefined;
    _passwordJoinFailed: boolean;
    _renderPassword: boolean;
    showCopyUrlButton: any;
};
