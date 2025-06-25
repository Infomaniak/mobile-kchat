import React from 'react';
import { GestureResponderEvent } from 'react-native';
export interface IProps {
    /**
     * The children to be displayed within this list.
     */
    children: React.ReactNode;
    /**
     * Callback to invoke when the {@code CollapsibleList} is long pressed.
     */
    onLongPress?: (e?: GestureResponderEvent) => void;
    /**
     * Collapsible list title.
     */
    title: Object;
}
declare const CollapsibleList: ({ children, onLongPress, title }: IProps) => JSX.Element;
export default CollapsibleList;
