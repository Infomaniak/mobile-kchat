import React from 'react';
import AbstractKickRemoteParticipantDialog from '../AbstractKickRemoteParticipantDialog';
/**
 * Dialog to confirm a remote participant kick action.
 */
declare class KickRemoteParticipantDialog extends AbstractKickRemoteParticipantDialog {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<KickRemoteParticipantDialog> & import("../AbstractKickRemoteParticipantDialog").IProps, "dispatch">, keyof import("react-i18next").WithTranslation>>;
export default _default;
