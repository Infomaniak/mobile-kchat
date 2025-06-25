import React from 'react';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link ParticipantsPaneButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether or not the participants pane is open.
     */
    _isOpen: boolean;
    /**
     * Whether participants feature is enabled or not.
     */
    _isParticipantsPaneEnabled: boolean;
}
/**
 * Implementation of a button for accessing participants pane.
 */
declare class ParticipantsPaneButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    toggledAccessibilityLabel: string;
    icon: any;
    label: string;
    tooltip: string;
    toggledTooltip: string;
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled(): boolean;
    /**
    * Handles clicking the button, and toggles the participants pane.
    *
    * @private
    * @returns {void}
    */
    _handleClick(): void;
    /**
     * Overrides AbstractButton's {@link Component#render()}.
     *
     * @override
     * @protected
     * @returns {React$Node}
     */
    render(): JSX.Element | null;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<React.ClassAttributes<ParticipantsPaneButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "_isOpen" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_isParticipantsPaneEnabled" | keyof React.ClassAttributes<ParticipantsPaneButton>> & Partial<Pick<React.ClassAttributes<ParticipantsPaneButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "dispatch" | "_isOpen" | "_isParticipantsPaneEnabled">, keyof import("react-i18next").WithTranslation>>;
export default _default;
