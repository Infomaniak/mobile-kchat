/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    _isNoiseSuppressionEnabled?: boolean;
}
/**
 * Component that renders a toolbar button for toggling noise suppression.
 */
declare class NoiseSuppressionButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    icon: any;
    label: string;
    tooltip: string;
    toggledIcon: any;
    toggledLabel: string;
    /**
     * Handles clicking / pressing the button.
     *
     * @private
     * @returns {void}
     */
    _handleClick(): void;
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled(): boolean | undefined;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<NoiseSuppressionButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_isNoiseSuppressionEnabled" | keyof import("react").ClassAttributes<NoiseSuppressionButton>> & Partial<Pick<import("react").ClassAttributes<NoiseSuppressionButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "dispatch" | "_isNoiseSuppressionEnabled">, keyof import("react-i18next").WithTranslation>>;
export default _default;
