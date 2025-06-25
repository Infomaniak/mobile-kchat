import React from 'react';
import AbstractUserMediaPermissionsOverlay from './AbstractUserMediaPermissionsOverlay';
/**
 * Implements a React Component for overlay with guidance how to proceed with
 * gUM prompt.
 */
declare class UserMediaPermissionsOverlay extends AbstractUserMediaPermissionsOverlay {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Renders the policy logo.
     *
     * @private
     * @returns {ReactElement|null}
     */
    _renderPolicyLogo(): JSX.Element | null;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<UserMediaPermissionsOverlay> & import("./AbstractUserMediaPermissionsOverlay").IProps, "browser" | "_premeetingBackground">, keyof import("react-i18next").WithTranslation>>;
export default _default;
