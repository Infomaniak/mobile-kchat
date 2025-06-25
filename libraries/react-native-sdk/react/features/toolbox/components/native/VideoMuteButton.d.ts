/// <reference types="react" />
import AbstractVideoMuteButton, { IProps } from '../AbstractVideoMuteButton';
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<AbstractVideoMuteButton<IProps>> & IProps, "dispatch" | "t" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "buttonKey" | "contextMenu" | "handleClick" | "isMenuButton" | "notifyMode" | "_videoDisabled" | "_videoMuted" | keyof import("react").ClassAttributes<AbstractVideoMuteButton<IProps>>> & Partial<Pick<import("react").ClassAttributes<AbstractVideoMuteButton<IProps>> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_videoDisabled" | "_videoMuted">, keyof import("react-i18next").WithTranslation>>;
export default _default;
