import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of {@link LogoutDialog}'s React {@code Component} props.
 */
export interface IProps extends WithTranslation {
    /**
     * Logout handler.
     */
    onLogout: () => void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<IProps, never>, keyof WithTranslation>>;
export default _default;
