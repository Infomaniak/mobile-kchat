/// <reference types="react" />
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link ToggleCameraButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * Whether the current conference is in audio only mode or not.
     */
    _audioOnly: boolean;
    /**
     * Whether video is currently muted or not.
     */
    _videoMuted: boolean;
}
/**
 * An implementation of a button for toggling the camera facing mode.
 */
declare class ToggleCameraButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    icon: any;
    label: string;
    /**
     * Handles clicking/pressing the button.
     *
     * @returns {void}
     */
    _handleClick(): void;
    /**
     * Whether this button is disabled or not.
     *
     * @returns {boolean}
     */
    _isDisabled(): boolean;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<ToggleCameraButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_audioOnly" | "_videoMuted" | keyof import("react").ClassAttributes<ToggleCameraButton>> & Partial<Pick<import("react").ClassAttributes<ToggleCameraButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_audioOnly" | "_videoMuted">, keyof import("react-i18next").WithTranslation>>;
export default _default;
