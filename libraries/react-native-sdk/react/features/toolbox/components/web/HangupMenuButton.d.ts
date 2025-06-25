import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link HangupMenuButton}.
 */
export interface IProps extends WithTranslation {
    /**
     * ID of the menu that is controlled by this button.
     */
    ariaControls: String;
    /**
     * A child React Element to display within {@code InlineDialog}.
     */
    children: React.ReactNode;
    /**
     * Whether or not the HangupMenu popover should display.
     */
    isOpen: boolean;
    /**
     * Notify mode for `toolbarButtonClicked` event -
     * whether to only notify or to also prevent button click routine.
     */
    notifyMode?: string;
    /**
     * Callback to change the visibility of the hangup menu.
     */
    onVisibilityChange: Function;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>;
export default _default;
