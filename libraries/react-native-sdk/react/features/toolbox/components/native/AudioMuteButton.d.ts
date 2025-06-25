/// <reference types="react" />
import AbstractAudioMuteButton, { IProps } from '../AbstractAudioMuteButton';
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<AbstractAudioMuteButton<IProps>> & IProps, "dispatch" | "t" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "buttonKey" | "contextMenu" | "handleClick" | "isMenuButton" | "notifyMode" | "_audioMuted" | "_disabled" | keyof import("react").ClassAttributes<AbstractAudioMuteButton<IProps>>> & Partial<Pick<import("react").ClassAttributes<AbstractAudioMuteButton<IProps>> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_audioMuted" | "_disabled">, keyof import("react-i18next").WithTranslation>>;
export default _default;
