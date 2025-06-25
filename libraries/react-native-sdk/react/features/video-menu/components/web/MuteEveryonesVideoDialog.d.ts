import React from 'react';
import AbstractMuteEveryonesVideoDialog, { type IProps } from '../AbstractMuteEveryonesVideoDialog';
/**
 * A React Component with the contents for a dialog that asks for confirmation
 * from the user before disabling all remote participants cameras.
 *
 * @augments AbstractMuteEveryonesVideoDialog
 */
declare class MuteEveryonesVideoDialog extends AbstractMuteEveryonesVideoDialog<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<React.ClassAttributes<MuteEveryonesVideoDialog> & IProps, "title" | "dispatch" | "t" | "content" | "i18n" | "tReady" | "participantID" | "isModerationSupported" | "showAdvancedModerationToggle" | "isVideoModerationOn" | "isVideoModerationEnabled" | keyof React.ClassAttributes<MuteEveryonesVideoDialog>> & Partial<Pick<React.ClassAttributes<MuteEveryonesVideoDialog> & IProps, "exclude">> & Partial<Pick<{
    exclude: never[];
    muteLocal: boolean;
}, "muteLocal">>, "title" | "dispatch" | "content" | "isModerationSupported" | "isVideoModerationEnabled"> & IProps, keyof import("react-i18next").WithTranslation>>;
export default _default;
