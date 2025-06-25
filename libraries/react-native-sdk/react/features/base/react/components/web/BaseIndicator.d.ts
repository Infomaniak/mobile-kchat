import React from 'react';
import { WithTranslation } from 'react-i18next';
import { TOOLTIP_POSITION } from '../../../ui/constants.any';
/**
 * The type of the React {@code Component} props of {@link BaseIndicator}.
 */
export interface IProps extends WithTranslation {
    /**
     * Additional CSS class name.
     */
    className?: string;
    /**
     * The icon component to use.
     */
    icon: Function;
    /**
     * The CSS classnames to set on the icon element of the component.
    */
    iconClassName?: string;
    /**
     * The color of the icon.
     */
    iconColor?: string;
    /**
     * Id of the icon to be rendered.
     */
    iconId?: string;
    /**
     * The font size for the icon.
     */
    iconSize: string | number;
    /**
     * The ID attribute to set on the root element of the component.
     */
    id?: string;
    /**
     * The translation key to use for displaying a tooltip when hovering over
     * the component.
     */
    tooltipKey: string;
    /**
     * From which side of the indicator the tooltip should appear from,
     * defaulting to "top".
     */
    tooltipPosition: TOOLTIP_POSITION;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
