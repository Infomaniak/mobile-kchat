/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link ScreenSharingAndroidButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * True if the button needs to be disabled.
     */
    _disabled: boolean;
    /**
     * Whether video is currently muted or not.
     */
    _screensharing: boolean;
}
/**
 * An implementation of a button for toggling screen sharing.
 */
declare class ScreenSharingAndroidButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    icon: any;
    label: string;
    toggledLabel: string;
    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick(): void;
    /**
     * Returns a boolean value indicating if this button is disabled or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isDisabled(): boolean;
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled(): boolean;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<ScreenSharingAndroidButton> & IProps, "dispatch" | "t" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "buttonKey" | "contextMenu" | "handleClick" | "isMenuButton" | "notifyMode" | "_disabled" | "_screensharing" | keyof import("react").ClassAttributes<ScreenSharingAndroidButton>> & Partial<Pick<import("react").ClassAttributes<ScreenSharingAndroidButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_screensharing">, keyof import("react-i18next").WithTranslation>>;
export default _default;
