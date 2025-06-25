import React, { ReactNode } from 'react';
import { TEXT_OVERFLOW_TYPES } from '../../constants.any';
export interface IProps {
    /**
     * Label used for accessibility.
     */
    accessibilityLabel: string;
    /**
     * The context menu item background color.
     */
    backgroundColor?: string;
    /**
     * Component children.
     */
    children?: ReactNode;
    /**
     * CSS class name used for custom styles.
     */
    className?: string;
    /**
     * Id of dom element controlled by this item. Matches aria-controls.
     * Useful if you need this item as a tab element.
     *
     */
    controls?: string;
    /**
     * Custom icon. If used, the icon prop is ignored.
     * Used to allow custom children instead of just the default icons.
     */
    customIcon?: ReactNode;
    /**
     * Whether or not the action is disabled.
     */
    disabled?: boolean;
    /**
     * Default icon for action.
     */
    icon?: Function;
    /**
     * Id of the action container.
     */
    id?: string;
    /**
     * Click handler.
     */
    onClick?: (e?: React.MouseEvent<any>) => void;
    /**
     * Keydown handler.
     */
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    /**
     * Keypress handler.
     */
    onKeyPress?: (e?: React.KeyboardEvent) => void;
    /**
     * Overflow type for item text.
     */
    overflowType?: TEXT_OVERFLOW_TYPES;
    /**
     * You can use this item as a tab. Defaults to button if not set.
     *
     * If no onClick handler is provided, we assume the context menu item is
     * not interactive and no role will be set.
     */
    role?: 'tab' | 'button' | 'menuitem';
    /**
     * Whether the item is marked as selected.
     */
    selected?: boolean;
    /**
     * TestId of the element, if any.
     */
    testId?: string;
    /**
     * Action text.
     */
    text?: string;
    /**
     * Class name for the text.
     */
    textClassName?: string;
}
declare const ContextMenuItem: ({ accessibilityLabel, backgroundColor, children, className, controls, customIcon, disabled, id, icon, onClick, onKeyDown, onKeyPress, overflowType, role, selected, testId, text, textClassName }: IProps) => JSX.Element;
export default ContextMenuItem;
