/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
export interface IProps extends AbstractButtonProps {
    /**
     * The ID of the participant that this button is supposed to pin.
     */
    participantID: string;
}
/**
 * A remote video menu button which shows the connection statistics.
 */
declare class ConnectionStatusButton extends AbstractButton<IProps> {
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
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<ConnectionStatusButton> & IProps, "dispatch" | "t" | "i18n" | "tReady" | "participantID" | "backgroundColor" | "customClass" | "buttonKey" | "contextMenu" | "handleClick" | "isMenuButton" | "notifyMode" | keyof import("react").ClassAttributes<ConnectionStatusButton>> & Partial<Pick<import("react").ClassAttributes<ConnectionStatusButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "dispatch">, keyof import("react-i18next").WithTranslation>>;
export default _default;
