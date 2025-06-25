import React, { ReactElement } from 'react';
import { IGUMPendingState } from '../../../base/media/types';
import AbstractVideoMuteButton, { IProps as AbstractVideoMuteButtonProps } from '../AbstractVideoMuteButton';
declare const styles: () => {
    pendingContainer: {
        position: "absolute";
        bottom: string;
        right: string;
    };
};
/**
 * The type of the React {@code Component} props of {@link VideoMuteButton}.
 */
export interface IProps extends AbstractVideoMuteButtonProps {
    /**
     * The gumPending state from redux.
     */
    _gumPending: IGUMPendingState;
    /**
     * An object containing the CSS classes.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
}
/**
 * Component that renders a toolbar button for toggling video mute.
 *
 * @augments AbstractVideoMuteButton
 */
declare class VideoMuteButton extends AbstractVideoMuteButton<IProps> {
    /**
     * Initializes a new {@code VideoMuteButton} instance.
     *
     * @param {IProps} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Registers the keyboard shortcut that toggles the video muting.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Unregisters the keyboard shortcut that toggles the video muting.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount(): void;
    /**
     * Gets the current accessibility label, taking the toggled and GUM pending state into account. If no toggled label
     * is provided, the regular accessibility label will also be used in the toggled state.
     *
     * The accessibility label is not visible in the UI, it is meant to be used by assistive technologies, mainly screen
     * readers.
     *
     * @private
     * @returns {string}
     */
    _getAccessibilityLabel(): string;
    /**
     * Gets the current label, taking the toggled and GUM pending state into account. If no
     * toggled label is provided, the regular label will also be used in the toggled state.
     *
     * @private
     * @returns {string}
     */
    _getLabel(): string;
    /**
     * Indicates if video is currently muted or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isVideoMuted(): boolean;
    /**
     * Returns a spinner if there is pending GUM.
     *
     * @returns {ReactElement | null}
     */
    _getElementAfter(): ReactElement | null;
    /**
     * Creates an analytics keyboard shortcut event and dispatches an action to
     * toggle the video muting.
     *
     * @private
     * @returns {void}
     */
    _onKeyboardShortcut(): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<React.ClassAttributes<VideoMuteButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "classes" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_gumPending" | "_videoMuted" | "_videoDisabled" | keyof React.ClassAttributes<VideoMuteButton>> & Partial<Pick<React.ClassAttributes<VideoMuteButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_gumPending" | "_videoMuted" | "_videoDisabled">, keyof import("react-i18next").WithTranslation>>;
export default _default;
