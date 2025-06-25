import React from 'react';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    icon: any;
    id?: string;
    text: string;
}
/**
 * Component that renders a custom button.
 *
 * @returns {Component}
 */
declare class CustomOptionButton extends AbstractButton<IProps> {
    iconSrc: any;
    id: string | undefined;
    text: string;
    /**
     * Custom icon component.
     *
     * @returns {React.Component}
     */
    icon: () => JSX.Element | null;
    label: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<React.ClassAttributes<CustomOptionButton> & IProps, "id" | "dispatch" | "icon" | "text" | "t" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "buttonKey" | "contextMenu" | "handleClick" | "isMenuButton" | "notifyMode" | keyof React.ClassAttributes<CustomOptionButton>> & Partial<Pick<React.ClassAttributes<CustomOptionButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
    afterClick: undefined;
    disabledStyles: {
        iconStyle: {
            opacity: number;
        };
        labelStyle: {
            opacity: number;
        };
        style: undefined;
        underlayColor: undefined;
    };
    showLabel: boolean;
    styles: undefined;
    toggledStyles: undefined;
    tooltipPosition: string;
    visible: boolean;
}, never>>, "dispatch">, keyof import("react-i18next").WithTranslation>>;
export default _default;
