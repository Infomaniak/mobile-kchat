/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link ToggleSelfViewButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether the self view is disabled or not.
     */
    _disableSelfView: boolean;
}
/**
 * An implementation of a button for toggling the self view.
 */
declare class ToggleSelfViewButton extends AbstractButton<IProps> {
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
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled(): boolean;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<ToggleSelfViewButton> & IProps, "dispatch" | "t" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "buttonKey" | "contextMenu" | "handleClick" | "isMenuButton" | "notifyMode" | "_disableSelfView" | keyof import("react").ClassAttributes<ToggleSelfViewButton>> & Partial<Pick<import("react").ClassAttributes<ToggleSelfViewButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "dispatch" | "_disableSelfView">, keyof import("react-i18next").WithTranslation>>;
export default _default;
