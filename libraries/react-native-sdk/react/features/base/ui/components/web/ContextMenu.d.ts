import React, { ReactNode } from 'react';
export interface IProps {
    /**
     * ARIA attributes.
     */
    [key: `aria-${string}`]: string;
    /**
     * Accessibility label for menu container.
     */
    accessibilityLabel?: string;
    /**
     * To activate the FocusOn component.
     */
    activateFocusTrap?: boolean;
    /**
     * Children of the context menu.
     */
    children: ReactNode;
    /**
     * Class name for context menu. Used to overwrite default styles.
     */
    className?: string;
    /**
     * The entity for which the context menu is displayed.
     */
    entity?: Object;
    /**
     * Whether or not the menu is hidden. Used to overwrite the internal isHidden.
     */
    hidden?: boolean;
    /**
     * Optional id.
     */
    id?: string;
    /**
     * Whether or not the menu is already in a drawer.
     */
    inDrawer?: boolean;
    /**
     * Whether or not drawer should be open.
     */
    isDrawerOpen?: boolean;
    /**
     * Target elements against which positioning calculations are made.
     */
    offsetTarget?: HTMLElement | null;
    /**
     * Callback for click on an item in the menu.
     */
    onClick?: (e?: React.MouseEvent) => void;
    /**
     * Callback for drawer close.
     */
    onDrawerClose?: (e?: React.MouseEvent) => void;
    /**
     * Keydown handler.
     */
    onKeyDown?: (e?: React.KeyboardEvent) => void;
    /**
     * Callback for the mouse entering the component.
     */
    onMouseEnter?: (e?: React.MouseEvent) => void;
    /**
     * Callback for the mouse leaving the component.
     */
    onMouseLeave?: (e?: React.MouseEvent) => void;
    /**
     * Container role.
     */
    role?: string;
    /**
     * Tab index for the menu.
     */
    tabIndex?: number;
}
declare const ContextMenu: ({ accessibilityLabel, activateFocusTrap, children, className, entity, hidden, id, inDrawer, isDrawerOpen, offsetTarget, onClick, onKeyDown, onDrawerClose, onMouseEnter, onMouseLeave, role, tabIndex, ...aria }: IProps) => JSX.Element;
export default ContextMenu;
