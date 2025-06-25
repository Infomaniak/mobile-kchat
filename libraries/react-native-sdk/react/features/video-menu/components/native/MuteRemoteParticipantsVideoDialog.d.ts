import React from 'react';
import AbstractMuteRemoteParticipantsVideoDialog from '../AbstractMuteRemoteParticipantsVideoDialog';
/**
 * Dialog to confirm a remote participant's video stop action.
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
