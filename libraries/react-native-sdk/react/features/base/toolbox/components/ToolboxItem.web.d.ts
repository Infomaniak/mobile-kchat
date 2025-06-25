import React from 'react';
import AbstractToolboxItem from './AbstractToolboxItem';
import type { IProps as AbstractToolboxItemProps } from './AbstractToolboxItem';
export interface IProps extends AbstractToolboxItemProps {
    /**
     * The button's background color.
     */
    backgroundColor?: string;
    /**
     * Whether or not the item is displayed in a context menu.
     */
    contextMenu?: boolean;
    /**
     * Whether the button open a menu or not.
     */
    isMenuButton?: boolean;
    /**
    * On key down handler.
    */
    onKeyDown: (e?: React.KeyboardEvent) => void;
}
/**
 * Web implementation of {@code AbstractToolboxItem}.
 */
export default class ToolboxItem extends AbstractToolboxItem<IProps> {
    /**
     * Initializes a new {@code ToolboxItem} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Handles 'Enter' and Space key on the button to trigger onClick for accessibility.
     *
     * @param {Object} event - The key event.
     * @private
     * @returns {void}
     */
    _onKeyPress(event?: React.KeyboardEvent): void;
    /**
     * Handles rendering of the actual item. If the label is being shown, which
     * is controlled with the `showLabel` prop, the item is rendered for its
     * display in an overflow menu, otherwise it will only have an icon, which
     * can be displayed on any toolbar.
     *
     * @protected
     * @returns {ReactElement}
     */
    _renderItem(): JSX.Element;
    /**
     * Helper function to render the item's icon.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderIcon(): React.DetailedReactHTMLElement<{
        className: string;
        style: {
            backgroundColor: string;
        } | {
            backgroundColor?: undefined;
        };
    }, HTMLElement>;
}
