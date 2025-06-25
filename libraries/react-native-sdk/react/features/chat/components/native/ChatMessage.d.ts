import React, { Component } from 'react';
import { IChatMessageProps } from '../../types';
/**
 * Renders a single chat message.
 */
declare class ChatMessage extends Component<IChatMessageProps> {
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Renders the avatar of the sender.
     *
     * @returns {React$Element<*>}
     */
    _renderAvatar(): JSX.Element;
    /**
     * Renders the display name of the sender if necessary.
     *
     * @returns {React$Element<*> | null}
     */
    _renderDisplayName(): JSX.Element | null;
    /**
     * Renders the message privacy notice, if necessary.
     *
     * @returns {React$Element<*> | null}
     */
    _renderPrivateNotice(): JSX.Element | null;
    /**
     * Renders the private reply button, if necessary.
     *
     * @returns {React$Element<*> | null}
     */
    _renderPrivateReplyButton(): JSX.Element | null;
    /**
     * Renders the time at which the message was sent, if necessary.
     *
     * @returns {React$Element<*> | null}
     */
    _renderTimestamp(): JSX.Element | null;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<ChatMessage> & IChatMessageProps, "knocking" | "canReply"> & IChatMessageProps, keyof import("react-i18next").WithTranslation>>;
export default _default;
