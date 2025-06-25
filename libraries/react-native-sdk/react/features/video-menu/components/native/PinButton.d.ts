/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * True if tile view is currently enabled.
     */
    _tileViewEnabled?: boolean;
    /**
     * The ID of the participant that this button is supposed to pin.
     */
    participantID: string;
}
/**
 * A remote video menu button which pins a participant and exist the tile view.
 */
declare class PinButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    icon: any;
    label: string;
    /**
     * Handles clicking / pressing the button, and kicks the participant.
     *
     * @private
     * @returns {void}
     */
    _handleClick(): void;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<PinButton> & IProps, "dispatch" | "t" | "i18n" | "tReady" | "participantID" | "backgroundColor" | "customClass" | "buttonKey" | "contextMenu" | "handleClick" | "isMenuButton" | "notifyMode" | "_tileViewEnabled" | keyof import("react").ClassAttributes<PinButton>> & Partial<Pick<import("react").ClassAttributes<PinButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
