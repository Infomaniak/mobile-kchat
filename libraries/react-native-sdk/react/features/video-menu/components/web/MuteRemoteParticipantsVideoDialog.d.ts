import React from 'react';
import AbstractMuteRemoteParticipantsVideoDialog from '../AbstractMuteRemoteParticipantsVideoDialog';
/**
 * A React Component with the contents for a dialog that asks for confirmation
 * from the user before disabling a remote participants camera.
 *
 * @augments Component
 */
declare class MuteRemoteParticipantsVideoDialog extends AbstractMuteRemoteParticipantsVideoDialog {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<MuteRemoteParticipantsVideoDialog> & import("../AbstractMuteRemoteParticipantsVideoDialog").IProps, "dispatch" | "isVideoModerationOn">, keyof import("react-i18next").WithTranslation>>;
export default _default;
