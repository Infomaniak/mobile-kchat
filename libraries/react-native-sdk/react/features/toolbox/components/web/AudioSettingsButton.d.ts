import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IGUMPendingState } from '../../../base/media/types';
export interface IProps extends WithTranslation {
    /**
     * The button's key.
     */
    buttonKey?: string;
    /**
     * The gumPending state from redux.
     */
    gumPending: IGUMPendingState;
    /**
     * External handler for click action.
     */
    handleClick: Function;
    /**
     * Indicates whether audio permissions have been granted or denied.
     */
    hasPermissions: boolean;
    /**
     * If the button should be disabled.
     */
    isDisabled: boolean;
    /**
     * Defines is popup is open.
     */
    isOpen: boolean;
    /**
     * Notify mode for `toolbarButtonClicked` event -
     * whether to only notify or to also prevent button click routine.
     */
    notifyMode?: string;
    /**
     * Click handler for the small icon. Opens audio options.
     */
    onAudioOptionsClick: Function;
    /**
     * Flag controlling the visibility of the button.
     * AudioSettings popup is disabled on mobile browsers.
     */
    visible: boolean;
}
/**
 * Button used for audio & audio settings.
 *
 * @returns {ReactElement}
 */
declare class AudioSettingsButton extends Component<IProps> {
    /**
     * Initializes a new {@code AudioSettingsButton} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Click handler for the more actions entries.
     *
     * @param {KeyboardEvent} event - Esc key click to close the popup.
     * @returns {void}
     */
    _onEscClick(event: React.KeyboardEvent): void;
    /**
     * Click handler for the more actions entries.
     *
     * @param {MouseEvent} e - Mouse event.
     * @returns {void}
     */
    _onClick(e?: React.MouseEvent): void;
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<AudioSettingsButton> & IProps, "visible" | "isOpen" | "isDisabled" | "gumPending" | "hasPermissions" | "onAudioOptionsClick">, keyof WithTranslation>>;
export default _default;
