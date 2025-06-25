/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link VideoBackgroundButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * True if the video background is blurred or false if it is not.
     */
    _isBackgroundEnabled: boolean;
}
/**
 * An abstract implementation of a button that toggles the video background dialog.
 */
declare class VideoBackgroundButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    icon: any;
    label: string;
    tooltip: string;
    /**
     * Handles clicking / pressing the button, and toggles the virtual background dialog
     * state accordingly.
     *
     * @protected
     * @returns {void}
     */
    _handleClick(): void;
    /**
     * Returns {@code boolean} value indicating if the background effect is
     * enabled or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isToggled(): boolean;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<VideoBackgroundButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_isBackgroundEnabled" | keyof import("react").ClassAttributes<VideoBackgroundButton>> & Partial<Pick<import("react").ClassAttributes<VideoBackgroundButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_isBackgroundEnabled">, keyof import("react-i18next").WithTranslation>>;
export default _default;
