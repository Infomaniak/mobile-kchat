/// <reference types="react" />
import { AbstractClosedCaptionButton } from '../AbstractClosedCaptionButton';
/**
 * A button which starts/stops the transcriptions.
 */
declare class ClosedCaptionButton extends AbstractClosedCaptionButton {
    accessibilityLabel: string;
    icon: any;
    tooltip: string;
    label: string;
    labelProps: {
        language: string;
        languages: string;
        languagesHead: string;
    };
    /**
     * Toggle language selection dialog.
     *
     * @returns {void}
     */
    _handleClickOpenLanguageSelector(): void;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<ClosedCaptionButton> & import("../AbstractClosedCaptionButton").IAbstractProps, "dispatch" | "languages" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_language" | "_requestingSubtitles" | "_subtitles" | "languagesHead" | keyof import("react").ClassAttributes<ClosedCaptionButton>> & Partial<Pick<import("react").ClassAttributes<ClosedCaptionButton> & import("../AbstractClosedCaptionButton").IAbstractProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_language" | "_requestingSubtitles"> & import("../AbstractClosedCaptionButton").IAbstractProps, keyof import("react-i18next").WithTranslation>>;
export default _default;
