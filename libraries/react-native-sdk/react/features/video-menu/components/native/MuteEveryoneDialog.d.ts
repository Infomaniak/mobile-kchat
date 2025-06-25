import React from 'react';
import AbstractMuteEveryoneDialog, { type IProps } from '../AbstractMuteEveryoneDialog';
/**
 * A React Component with the contents for a dialog that asks for confirmation
 * from the user before muting all remote participants.
 *
 * @augments AbstractMuteEveryoneDialog
 */
declare class MuteEveryoneDialog extends AbstractMuteEveryoneDialog<IProps> {
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
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<React.ClassAttributes<MuteEveryoneDialog> & IProps, "dispatch" | "title" | "t" | "i18n" | "tReady" | "participantID" | "content" | "isAudioModerationEnabled" | "isModerationSupported" | "showAdvancedModerationToggle" | keyof React.ClassAttributes<MuteEveryoneDialog>> & Partial<Pick<React.ClassAttributes<MuteEveryoneDialog> & IProps, "exclude">> & Partial<Pick<{
    exclude: never[];
    muteLocal: boolean;
}, "muteLocal">>, "dispatch" | "title" | "content" | "isAudioModerationEnabled" | "isModerationSupported"> & IProps, keyof import("react-i18next").WithTranslation>>;
export default _default;
