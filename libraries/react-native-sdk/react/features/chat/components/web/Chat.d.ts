import React from 'react';
import { IChatProps as AbstractProps } from '../../types';
export interface IProps extends AbstractProps {
    /**
     * Whether the chat is opened in a modal or not (computed based on window width).
     */
    _isModal: boolean;
    /**
     * True if the chat window should be rendered.
     */
    _isOpen: boolean;
    /**
     * True if the polls feature is enabled.
     */
    _isPollsEnabled: boolean;
    /**
     * Whether the poll tab is focused or not.
     */
    _isPollsTabFocused: boolean;
    /**
     * Number of unread poll messages.
     */
    _nbUnreadPolls: number;
    /**
     * Function to send a text message.
     *
     * @protected
     */
    _onSendMessage: Function;
    /**
     * Function to toggle the chat window.
     */
    _onToggleChat: Function;
    /**
     * Function to display the chat tab.
     *
     * @protected
     */
    _onToggleChatTab: Function;
    /**
     * Function to display the polls tab.
     *
     * @protected
     */
    _onTogglePollsTab: Function;
    /**
     * Whether or not to block chat access with a nickname input form.
     */
    _showNamePrompt: boolean;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
