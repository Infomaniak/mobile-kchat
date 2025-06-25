/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * Whether or not the button is toggled.
     */
    _toggled: boolean;
}
/**
 * Component that renders a toolbar button for the whiteboard.
 */
declare class WhiteboardButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    toggledAccessibilityLabel: string;
    icon: any;
    label: string;
    toggledIcon: any;
    toggledLabel: string;
    toggledTooltip: string;
    tooltip: string;
    /**
     * Handles clicking / pressing the button, and opens / closes the whiteboard view.
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
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<WhiteboardButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_toggled" | keyof import("react").ClassAttributes<WhiteboardButton>> & Partial<Pick<import("react").ClassAttributes<WhiteboardButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_toggled">, keyof import("react-i18next").WithTranslation>>;
export default _default;
