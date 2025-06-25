/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * Whether or not screensharing is initialized.
     */
    _desktopSharingEnabled: boolean;
    /**
     * Whether or not the local participant is screensharing.
     */
    _screensharing: boolean;
}
/**
 * Implementation of a button for sharing desktop / windows.
 */
declare class ShareDesktopButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    toggledAccessibilityLabel: string;
    label: string;
    icon: any;
    toggledLabel: string;
    /**
     * Retrieves tooltip dynamically.
     *
     * @returns {string}
     */
    _getTooltip(): "toolbar.stopScreenSharing" | "toolbar.startScreenSharing" | "dialog.shareYourScreenDisabled";
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled(): boolean;
    /**
     * Indicates whether this button is in disabled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled(): boolean;
    /**
     * Handles clicking the button, and toggles the chat.
     *
     * @private
     * @returns {void}
     */
    _handleClick(): void;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<ShareDesktopButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_screensharing" | "_desktopSharingEnabled" | keyof import("react").ClassAttributes<ShareDesktopButton>> & Partial<Pick<import("react").ClassAttributes<ShareDesktopButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_screensharing" | "_desktopSharingEnabled">, keyof import("react-i18next").WithTranslation>>;
export default _default;
