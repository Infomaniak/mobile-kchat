import React from 'react';
import { WithTranslation } from 'react-i18next';
export interface INewMessagesButtonProps extends WithTranslation {
    /**
     * Function to notify messageContainer when click on goToFirstUnreadMessage button.
     */
    onGoToFirstUnreadMessage: () => void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<INewMessagesButtonProps, keyof WithTranslation>>;
export default _default;
