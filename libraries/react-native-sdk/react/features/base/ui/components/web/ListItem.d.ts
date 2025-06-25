import React, { ReactNode } from 'react';
export interface IProps {
    /**
     * List item actions.
     */
    actions: ReactNode;
    /**
     * List item container class name.
     */
    className?: string;
    /**
    * The breakout name for aria-label.
    */
    defaultName?: string;
    /**
     * Whether or not the actions should be hidden.
     */
    hideActions?: boolean;
    /**
     * Icon to be displayed on the list item. (Avatar for participants).
     */
    icon: ReactNode;
    /**
     * Id of the container.
     */
    id?: string;
    /**
     * Indicators to be displayed on the list item.
     */
    indicators?: ReactNode;
    /**
     * Whether or not the item is highlighted.
     */
    isHighlighted?: boolean;
    /**
     * Click handler.
     */
    onClick?: (e?: React.MouseEvent) => void;
    /**
     * Long press handler.
     */
    onLongPress?: (e?: EventTarget) => void;
    /**
     * Mouse leave handler.
     */
    onMouseLeave?: (e?: React.MouseEvent) => void;
    /**
     * Data test id.
     */
    testId?: string;
    /**
     * Text children to be displayed on the list item.
     */
    textChildren: ReactNode | string;
    /**
     * The actions trigger. Can be Hover or Permanent.
     */
    trigger: string;
}
declare const ListItem: ({ actions, className, defaultName, icon, id, hideActions, indicators, isHighlighted, onClick, onLongPress, onMouseLeave, testId, textChildren, trigger }: IProps) => JSX.Element;
export default ListItem;
