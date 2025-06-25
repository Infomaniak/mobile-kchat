/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
    * Whether or not the app is currently in full screen.
    */
    _fullScreen?: boolean;
}
/**
 * Implementation of a button for toggling fullscreen state.
 */
declare class FullscreenButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    toggledAccessibilityLabel: string;
    label: string;
    toggledLabel: string;
    tooltip: string;
    toggledTooltip: string;
    toggledIcon: any;
    icon: any;
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled(): boolean | undefined;
    /**
    * Handles clicking the button, and toggles fullscreen.
    *
    * @private
    * @returns {void}
    */
    _handleClick(): void;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<FullscreenButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_fullScreen" | keyof import("react").ClassAttributes<FullscreenButton>> & Partial<Pick<import("react").ClassAttributes<FullscreenButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_fullScreen">, keyof import("react-i18next").WithTranslation>>;
export default _default;
