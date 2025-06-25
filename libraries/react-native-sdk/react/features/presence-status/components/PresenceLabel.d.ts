import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link PresenceLabel}.
 */
export interface IProps extends WithTranslation {
    /**
     * The current present status associated with the passed in participantID
     * prop.
     */
    _presence: string;
    /**
     * Class name for the presence label.
     */
    className: string;
    /**
     * Default presence status that will be displayed if user's presence status
     * is not available.
     */
    defaultPresence: string;
    /**
     * The ID of the participant whose presence status should display.
     */
    participantID: string;
    /**
     * Styles for the presence label.
     */
    style: Object;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof WithTranslation>>;
export default _default;
