import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link Watermarks}.
 */
export interface IProps extends WithTranslation {
    /**
     * The link used to navigate to on logo click.
     */
    _logoLink: string;
    /**
     * The url for the logo.
     */
    _logoUrl?: string;
    /**
     * If the Jitsi watermark should be displayed or not.
     */
    _showJitsiWatermark: boolean;
    /**
     * The default value for the Jitsi logo URL.
     */
    defaultJitsiLogoURL?: string;
    /**
     * Whether the watermark should have a `top` and `left` value.
     */
    noMargins: boolean;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof WithTranslation>>;
export default _default;
