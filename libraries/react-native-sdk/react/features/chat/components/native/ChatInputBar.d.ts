import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * Application's aspect ratio.
     */
    aspectRatio: Symbol;
    /**
     * Callback to invoke on message send.
     */
    onSend: Function;
}
export interface IState {
    /**
     * Boolean to show if an extra padding needs to be added to the bar.
     */
    addPadding: boolean;
    /**
     * The value of the input field.
     */
    message: string;
    /**
     * Boolean to show or hide the send button.
     */
    showSend: boolean;
}
/**
 * Implements the chat input bar with text field and action(s).
 */
declare class ChatInputBar extends Component<IProps, IState> {
    /**
     * Instantiates a new instance of the component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Callback to handle the change of the value of the text field.
     *
     * @param {string} text - The current value of the field.
     * @returns {void}
     */
    _onChangeText(text: string): void;
    /**
     * Constructs a callback to be used to update the padding of the field if necessary.
     *
     * @param {boolean} focused - True of the field is focused.
     * @returns {Function}
     */
    _onFocused(focused: boolean): () => void;
    /**
     * Callback to handle the submit event of the text field.
     *
     * @returns {void}
     */
    _onSubmit(): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<ChatInputBar> & IProps, "aspectRatio">, keyof WithTranslation>>;
export default _default;
