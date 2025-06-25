/// <reference types="react" />
import { IJitsiConference } from '../../base/conference/reducer';
import AbstractButton, { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link FeedbackButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * The {@code JitsiConference} for the current conference.
     */
    _conference?: IJitsiConference;
}
/**
 * Implementation of a button for opening feedback dialog.
 */
declare class FeedbackButton extends AbstractButton<IProps> {
    accessibilityLabel: string;
    icon: any;
    label: string;
    tooltip: string;
    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick(): void;
}
declare const _default: import("react").ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<import("react").ClassAttributes<FeedbackButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "_conference" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | keyof import("react").ClassAttributes<FeedbackButton>> & Partial<Pick<import("react").ClassAttributes<FeedbackButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_conference">, keyof import("react-i18next").WithTranslation>>;
export default _default;
