import React from 'react';
import { AbstractChatPrivacyDialog } from '../AbstractChatPrivacyDialog';
/**
 * Implements a component for the dialog displayed to avoid mis-sending private messages.
 */
declare class ChatPrivacyDialog extends AbstractChatPrivacyDialog {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<ChatPrivacyDialog> & import("../AbstractChatPrivacyDialog").IProps, "_onSendMessage" | "_onSetMessageRecipient" | "_participant"> & import("../AbstractChatPrivacyDialog").IProps, keyof import("react-i18next").WithTranslation>>;
export default _default;
