/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * Whether or not the button is disabled.
     */
    _isDisabled: boolean;
    /**
     * Whether or not the local participant is sharing a video.
     */
    _sharingVideo: boolean;
}
/**
 * Implements an {@link AbstractButton} to open the user documentation in a new window.
 */
declare class SharedVideoButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    toggledAccessibilityLabel: string;
    icon: any;
    label: string;
    toggledLabel: string;
    tooltip: string;
    toggledTooltip: string;
    /**
     * Handles clicking / pressing the button, and opens a new dialog.
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
    _isToggled(): boolean;
    /**
     * Indicates whether this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled(): boolean;
    /**
     * Dispatches an action to toggle video sharing.
     *
     * @private
     * @returns {void}
     */
    _doToggleSharedVideo(): void;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<SharedVideoButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_isDisabled" | "_sharingVideo" | keyof import("react").ClassAttributes<SharedVideoButton>> & Partial<Pick<import("react").ClassAttributes<SharedVideoButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "dispatch" | "_isDisabled" | "_sharingVideo">, keyof import("react-i18next").WithTranslation>>;
export default _default;
