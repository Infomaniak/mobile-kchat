import React from 'react';
export interface IProps {
    /**
     * Aria label for the Icon.
     */
    ariaLabel?: string;
    /**
     * The decorated component (ToolboxButton).
     */
    children: React.ReactNode;
    /**
     * Icon of the button.
     */
    icon?: Function;
    /**
     * Flag used for disabling the small icon.
     */
    iconDisabled?: boolean;
    /**
     * Popover close callback.
     */
    onPopoverClose: Function;
    /**
     * Popover open callback.
     */
    onPopoverOpen: Function;
    /**
     * The content that will be displayed inside the popover.
     */
    popoverContent: React.ReactNode;
    /**
     * Additional styles.
     */
    styles?: Object;
    /**
     * Whether the trigger for open/ close should be click or hover.
     */
    trigger?: 'hover' | 'click';
    /**
     * Whether or not the popover is visible.
     */
    visible: boolean;
}
/**
 * Displays the `ToolboxButtonWithIcon` component.
 *
 * @param {Object} props - Component's props.
 * @returns {ReactElement}
 */
export default function ToolboxButtonWithPopup(props: IProps): JSX.Element;
