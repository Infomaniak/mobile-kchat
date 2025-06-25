/// <reference types="react" />
import AbstractSpeakerStatsButton from '../AbstractSpeakerStatsButton';
/**
 * Implementation of a button for opening speaker stats dialog.
 */
declare class SpeakerStatsButton extends AbstractSpeakerStatsButton {
    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick(): void | undefined;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<SpeakerStatsButton> & import("../../../base/toolbox/components/AbstractButton").IProps, "dispatch" | "t" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "buttonKey" | "contextMenu" | "handleClick" | "isMenuButton" | "notifyMode" | keyof import("react").ClassAttributes<SpeakerStatsButton>> & Partial<Pick<import("react").ClassAttributes<SpeakerStatsButton> & import("../../../base/toolbox/components/AbstractButton").IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch">, keyof import("react-i18next").WithTranslation>>;
export default _default;
