import React from 'react';
import { WithTranslation } from 'react-i18next';
export interface IProps extends WithTranslation {
    /**
     * The object representing the dialIn feature.
     */
    _dialIn: any;
    /**
     * Whether or not dial in number should be visible.
     */
    _dialInVisible: boolean;
    /**
     * Whether or not email sharing features should be visible.
     */
    _emailSharingVisible: boolean;
    /**
     * The meeting invitation text.
     */
    _invitationText: string;
    /**
     * The custom no new-lines meeting invitation text for iOS default email.
     * Needed because of this mailto: iOS issue: https://developer.apple.com/forums/thread/681023.
     */
    _invitationTextiOS: string;
    /**
     * An alternate app name to be displayed in the email subject.
     */
    _inviteAppName?: string | null;
    /**
     * Whether or not invite contacts should be visible.
     */
    _inviteContactsVisible: boolean;
    /**
     * The current url of the conference to be copied onto the clipboard.
     */
    _inviteUrl: string;
    /**
     * Whether the dial in limit has been exceeded.
     */
    _isDialInOverLimit?: boolean;
    /**
     * The current known URL for a live stream in progress.
     */
    _liveStreamViewURL?: string;
    /**
     * The default phone number.
     */
    _phoneNumber?: string | null;
    /**
     * Whether or not url sharing button should be visible.
     */
    _urlSharingVisible: boolean;
    /**
     * Method to update the dial in numbers.
     */
    updateNumbers: Function;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<IProps, "_dialIn" | "_dialInVisible" | "_urlSharingVisible" | "_emailSharingVisible" | "_invitationText" | "_invitationTextiOS" | "_inviteAppName" | "_inviteContactsVisible" | "_inviteUrl" | "_isDialInOverLimit" | "_liveStreamViewURL" | "_phoneNumber" | "updateNumbers"> & Partial<IProps>, keyof WithTranslation>>;
export default _default;
