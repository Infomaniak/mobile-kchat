import { ReactNode } from 'react';
import { IProps as ItemProps } from './ContextMenuItem';
export interface IProps {
    /**
     * List of actions in this group.
     */
    actions?: Array<ItemProps>;
    /**
     * The children of the component.
     */
    children?: ReactNode;
}
declare const ContextMenuItemGroup: ({ actions, children }: IProps) => JSX.Element;
export default ContextMenuItemGroup;
