/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * The URL to the user documentation.
     */
    _userDocumentationURL: string;
}
/**
 * Implements an {@link AbstractButton} to open the user documentation in a new window.
 */
declare class HelpButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    icon: any;
    label: string;
    tooltip: string;
    /**
     * Handles clicking / pressing the button, and opens a new window with the user documentation.
     *
     * @private
     * @returns {void}
     */
    _handleClick(): void;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<HelpButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_userDocumentationURL" | keyof import("react").ClassAttributes<HelpButton>> & Partial<Pick<import("react").ClassAttributes<HelpButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_userDocumentationURL">, keyof import("react-i18next").WithTranslation>>;
export default _default;
