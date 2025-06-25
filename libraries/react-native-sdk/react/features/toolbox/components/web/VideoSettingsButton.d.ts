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
     * Indicates whether video permissions have been granted or denied.
     */
    hasPermissions: boolean;
    /**
     * Whether there is a video track or not.
     */
    hasVideoTrack: boolean;
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
     * Click handler for the small icon. Opens video options.
     */
    onVideoOptionsClick: Function;
    /**
     * Flag controlling the visibility of the button.
     * VideoSettings popup is currently disabled on mobile browsers
     * as mobile devices do not support capture of more than one
     * camera at a time.
     */
    visible: boolean;
}
/**
 * Button used for video & video settings.
 *
 * @returns {ReactElement}
 */
declare class VideoSettingsButton extends Component<IProps> {
    /**
     * Initializes a new {@code VideoSettingsButton} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Returns true if the settings icon is disabled.
     *
     * @returns {boolean}
     */
    _isIconDisabled(): boolean;
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
     * @param {MouseEvent} e - Mousw event.
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
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<VideoSettingsButton> & IProps, "visible" | "isOpen" | "isDisabled" | "gumPending" | "hasPermissions" | "hasVideoTrack" | "onVideoOptionsClick">, keyof WithTranslation>>;
export default _default;
