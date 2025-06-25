import React from 'react';
/**
 * The type of the React {@code Component} props of {@link OverflowMenuButton}.
 */
export interface IProps {
    /**
     * ID of the menu that is controlled by this button.
     */
    ariaControls: string;
    /**
     * Information about the buttons that need to be rendered in the overflow menu.
     */
    buttons: Object[];
    /**
     * Whether or not the OverflowMenu popover should display.
     */
    isOpen: boolean;
    /**
     * Esc key handler.
     */
    onToolboxEscKey: (e?: React.KeyboardEvent) => void;
    /**
     * Callback to change the visibility of the overflow menu.
     */
    onVisibilityChange: Function;
    /**
     * Whether to show the raise hand in the reactions menu or not.
     */
    showRaiseHandInReactionsMenu: boolean;
    /**
     * Whether or not to display the reactions menu.
     */
    showReactionsMenu: boolean;
}
declare const OverflowMenuButton: ({ buttons, isOpen, onToolboxEscKey, onVisibilityChange, showRaiseHandInReactionsMenu, showReactionsMenu }: IProps) => JSX.Element;
export default OverflowMenuButton;
