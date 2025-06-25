import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * Dialog to inform the user that we couldn't fetch the dial-in info page.
 */
declare class DialInSummaryErrorDialog extends Component<WithTranslation> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<DialInSummaryErrorDialog> & WithTranslation, never>, keyof WithTranslation>>;
export default _default;
