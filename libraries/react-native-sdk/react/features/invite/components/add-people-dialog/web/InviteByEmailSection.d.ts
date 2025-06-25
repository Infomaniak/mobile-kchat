import React from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * The encoded invitation subject.
     */
    inviteSubject: string;
    /**
     * The encoded invitation text to be sent.
     */
    inviteText: string;
    /**
     * The encoded no new-lines iOS invitation text to be sent on default mail.
     */
    inviteTextiOS: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
