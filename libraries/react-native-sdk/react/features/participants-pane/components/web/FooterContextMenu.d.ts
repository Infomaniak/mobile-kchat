import React from 'react';
export interface IProps {
    /**
     * Whether the menu is open.
     */
    isOpen: boolean;
    /**
     * Drawer close callback.
     */
    onDrawerClose: (e?: React.MouseEvent) => void;
    /**
     * Callback for the mouse leaving this item.
     */
    onMouseLeave?: (e?: React.MouseEvent) => void;
}
export declare const FooterContextMenu: ({ isOpen, onDrawerClose, onMouseLeave }: IProps) => JSX.Element;
