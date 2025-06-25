import React, { ReactElement } from 'react';
import { IGUMPendingState } from '../../../base/media/types';
import AbstractAudioMuteButton, { IProps as AbstractAudioMuteButtonProps } from '../AbstractAudioMuteButton';
declare const styles: () => {
    pendingContainer: {
        position: "absolute";
        bottom: string;
        right: string;
    };
};
/**
 * The type of the React {@code Component} props of {@link AudioMuteButton}.
 */
export interface IProps extends AbstractAudioMuteButtonProps {
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
 * Component that renders a toolbar button for toggling audio mute.
 *
 * @augments AbstractAudioMuteButton
 */
declare class AudioMuteButton extends AbstractAudioMuteButton<IProps> {
    /**
     * Initializes a new {@code AudioMuteButton} instance.
     *
     * @param {IProps} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Registers the keyboard shortcut that toggles the audio muting.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Unregisters the keyboard shortcut that toggles the audio muting.
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
     * Indicates if audio is currently muted or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isAudioMuted(): boolean;
    /**
     * Creates an analytics keyboard shortcut event and dispatches an action to
     * toggle the audio muting.
     *
     * @private
     * @returns {void}
     */
    _onKeyboardShortcut(): void;
    /**
     * Returns a spinner if there is pending GUM.
     *
     * @returns {ReactElement | null}
     */
    _getElementAfter(): ReactElement | null;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<React.ClassAttributes<AudioMuteButton> & IProps, "dispatch" | "t" | "contextMenu" | "i18n" | "tReady" | "backgroundColor" | "classes" | "customClass" | "isMenuButton" | "buttonKey" | "handleClick" | "notifyMode" | "_disabled" | "_audioMuted" | "_gumPending" | keyof React.ClassAttributes<AudioMuteButton>> & Partial<Pick<React.ClassAttributes<AudioMuteButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
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
}, never>>, "visible" | "dispatch" | "_disabled" | "_audioMuted" | "_gumPending">, keyof import("react-i18next").WithTranslation>>;
export default _default;
