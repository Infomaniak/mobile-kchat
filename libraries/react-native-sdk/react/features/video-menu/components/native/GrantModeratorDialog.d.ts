import React from 'react';
import AbstractGrantModeratorDialog from '../AbstractGrantModeratorDialog';
/**
 * Dialog to confirm a remote participant kick action.
 */
declare class GrantModeratorDialog extends AbstractGrantModeratorDialog {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<GrantModeratorDialog> & import("../AbstractGrantModeratorDialog").IProps, "dispatch" | "participantName"> & import("../AbstractGrantModeratorDialog").IProps, keyof import("react-i18next").WithTranslation>>;
export default _default;
