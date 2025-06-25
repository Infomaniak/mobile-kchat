import React from 'react';
import AbstractMuteEveryonesVideoDialog, { type IProps } from '../AbstractMuteEveryonesVideoDialog';
/**
 * A React Component with the contents for a dialog that asks for confirmation
 * from the user before muting all remote participants.
 *
 * @augments AbstractMuteEveryonesVideoDialog
 */
declare class MuteEveryonesVideoDialog extends AbstractMuteEveryonesVideoDialog<IProps> {
    /**
     * Renders the dialog switch.
     *
     * @returns {React$Component}
     */
    _renderSwitch(): false | JSX.Element;
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<React.ClassAttributes<MuteEveryonesVideoDialog> & IProps, "dispatch" | "title" | "t" | "i18n" | "tReady" | "participantID" | "content" | "isModerationSupported" | "showAdvancedModerationToggle" | "isVideoModerationOn" | "isVideoModerationEnabled" | keyof React.ClassAttributes<MuteEveryonesVideoDialog>> & Partial<Pick<React.ClassAttributes<MuteEveryonesVideoDialog> & IProps, "exclude">> & Partial<Pick<{
    exclude: never[];
    muteLocal: boolean;
}, "muteLocal">>, "dispatch" | "title" | "content" | "isModerationSupported" | "isVideoModerationEnabled"> & IProps, keyof import("react-i18next").WithTranslation>>;
export default _default;
