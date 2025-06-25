import React, { PureComponent } from 'react';
import { IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of {@link OverflowMenu}.
 */
export interface IProps {
    /**
     * Custom Toolbar buttons.
     */
    _customToolbarButtons?: Array<{
        backgroundColor?: string;
        icon: string;
        id: string;
        text: string;
    }>;
    /**
     * True if breakout rooms feature is available, false otherwise.
     */
    _isBreakoutRoomsSupported?: boolean;
    /**
     * True if the overflow menu is currently visible, false otherwise.
     */
    _isOpen: boolean;
    /**
     * Whether or not speaker stats is disable.
     */
    _isSpeakerStatsDisabled?: boolean;
    /**
     * Whether the recoding button should be enabled or not.
    */
    _recordingEnabled: boolean;
    /**
     * Whether or not any reactions buttons should be displayed.
     */
    _shouldDisplayReactionsButtons: boolean;
    /**
     * The width of the screen.
     */
    _width: number;
    /**
     * Used for hiding the dialog when the selection was completed.
     */
    dispatch: IStore['dispatch'];
}
export interface IState {
    /**
     * True if the bottom sheet is scrolled to the top.
     */
    scrolledToTop: boolean;
}
/**
 * Implements a React {@code Component} with some extra actions in addition to
 * those in the toolbar.
 */
declare class OverflowMenu extends PureComponent<IProps, IState> {
    /**
     * Initializes a new {@code OverflowMenu} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Hides this {@code OverflowMenu}.
     *
     * @private
     * @returns {void}
     */
    _onCancel(): void;
    /**
     * Function to render the reaction menu as the footer of the bottom sheet.
     *
     * @returns {React.ReactElement}
     */
    _renderReactionMenu(): JSX.Element;
    /**
     * Function to render the custom buttons for the overflow menu.
     *
     * @param {Object} topButtonProps - Button properties.
     * @returns {React.ReactElement}
     */
    _renderCustomOverflowMenuButtons(topButtonProps: Object): JSX.Element | undefined;
}
declare const _default: import("react-redux").ConnectedComponent<typeof OverflowMenu, import("react-redux").Omit<React.ClassAttributes<OverflowMenu> & IProps, "dispatch" | "_width" | "_customToolbarButtons" | "_isBreakoutRoomsSupported" | "_isSpeakerStatsDisabled" | "_shouldDisplayReactionsButtons">>;
export default _default;
