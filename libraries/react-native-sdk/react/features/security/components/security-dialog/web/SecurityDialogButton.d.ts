/// <reference types="react" />
import AbstractSecurityDialogButton, { IProps as AbstractSecurityDialogButtonProps } from '../AbstractSecurityDialogButton';
/**
 * Implements an {@link AbstractSecurityDialogButton} to open the security dialog.
 */
declare class SecurityDialogButton<P extends AbstractSecurityDialogButtonProps, S> extends AbstractSecurityDialogButton<P, S> {
    /**
     * Opens / closes the security dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClickSecurityButton(): void;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<SecurityDialogButton<AbstractSecurityDialogButtonProps, unknown>> & AbstractSecurityDialogButtonProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_locked" | keyof import("react").ClassAttributes<SecurityDialogButton<AbstractSecurityDialogButtonProps, unknown>>> & Partial<Pick<import("react").ClassAttributes<SecurityDialogButton<AbstractSecurityDialogButtonProps, unknown>> & AbstractSecurityDialogButtonProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_locked">, keyof import("react-i18next").WithTranslation>>;
export default _default;
