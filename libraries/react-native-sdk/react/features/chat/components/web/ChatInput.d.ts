import React, { Component, RefObject } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of {@link ChatInput}.
 */
export interface IProps extends WithTranslation {
    /**
     * Whether chat emoticons are disabled.
     */
    _areSmileysDisabled: boolean;
    /**
     * The id of the message recipient, if any.
     */
    _privateMessageRecipientId?: string;
    /**
     * Invoked to send chat messages.
     */
    dispatch: IStore['dispatch'];
    /**
     * Callback to invoke on message send.
     */
    onSend: Function;
}
/**
 * The type of the React {@code Component} state of {@link ChatInput}.
 */
export interface IState {
    /**
     * User provided nickname when the input text is provided in the view.
     */
    message: string;
    /**
     * Whether or not the smiley selector is visible.
     */
    showSmileysPanel: boolean;
}
/**
 * Implements a React Component for drafting and submitting a chat message.
 *
 * @augments Component
 */
declare class ChatInput extends Component<IProps, IState> {
    _textArea?: RefObject<HTMLTextAreaElement>;
    state: {
        message: string;
        showSmileysPanel: boolean;
    };
    /**
     * Initializes a new {@code ChatInput} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#componentDidMount()}.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: Readonly<IProps>): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Place cursor focus on this component's text area.
     *
     * @private
     * @returns {void}
     */
    _focus(): void;
    /**
     * Submits the message to the chat window.
     *
     * @returns {void}
     */
    _onSubmitMessage(): void;
    /**
     * Detects if enter has been pressed. If so, submit the message in the chat
     * window.
     *
     * @param {string} event - Keyboard event.
     * @private
     * @returns {void}
     */
    _onDetectSubmit(event: any): void;
    /**
     * Updates the known message the user is drafting.
     *
     * @param {string} value - Keyboard event.
     * @private
     * @returns {void}
     */
    _onMessageChange(value: string): void;
    /**
     * Appends a selected smileys to the chat message draft.
     *
     * @param {string} smileyText - The value of the smiley to append to the
     * chat message.
     * @private
     * @returns {void}
     */
    _onSmileySelect(smileyText: string): void;
    /**
     * Callback invoked to hide or show the smileys selector.
     *
     * @private
     * @returns {void}
     */
    _toggleSmileysPanel(): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<ChatInput> & IProps, "dispatch" | "_areSmileysDisabled" | "_privateMessageRecipientId">, keyof WithTranslation>>;
export default _default;
