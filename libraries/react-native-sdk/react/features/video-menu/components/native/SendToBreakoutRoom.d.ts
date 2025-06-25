/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
import { IRoom } from '../../../breakout-rooms/types';
export interface IProps extends AbstractButtonProps {
    /**
     * ID of the participant to send to breakout room.
     */
    participantID: string;
    /**
     * Room to send participant to.
     */
    room: IRoom;
}
/**
 * An abstract remote video menu button which sends the remote participant to a breakout room.
 */
declare class SendToBreakoutRoom extends AbstractButton<IProps> {
    accessibilityLabel: string;
    icon: any;
    /**
     * Gets the current label.
     *
     * @returns {string}
     */
    _getLabel(): string;
    /**
     * Handles clicking / pressing the button, and asks the participant to unmute.
     *
     * @private
     * @returns {void}
     */
    _handleClick(): void;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<SendToBreakoutRoom> & IProps, "room" | "dispatch" | "t" | "i18n" | "tReady" | "participantID" | "backgroundColor" | "customClass" | "buttonKey" | "contextMenu" | "handleClick" | "isMenuButton" | "notifyMode" | keyof import("react").ClassAttributes<SendToBreakoutRoom>> & Partial<Pick<import("react").ClassAttributes<SendToBreakoutRoom> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
