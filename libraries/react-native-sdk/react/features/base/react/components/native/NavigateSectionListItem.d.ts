import { Component } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Item } from '../../types';
export interface IProps {
    /**
     * Item containing data to be rendered.
     */
    item: Item;
    /**
     * Function to be invoked when an item is long pressed. The item is passed.
     */
    onLongPress?: (e?: GestureResponderEvent) => void;
    /**
     * Function to be invoked when an Item is pressed. The Item's URL is passed.
     */
    onPress?: (e?: GestureResponderEvent) => void;
    /**
     * Function to be invoked when secondary action was performed on an Item.
     */
    secondaryAction?: (e?: GestureResponderEvent) => void;
}
/**
 * Implements a React/Native {@link Component} that renders the Navigate Section
 * List Item.
 *
 * @augments Component
 */
export default class NavigateSectionListItem extends Component<IProps> {
    /**
     * Constructor of the NavigateSectionList component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Renders a single line from the additional lines.
     *
     * @param {string} line - The line text.
     * @param {number} index - The index of the line.
     * @private
     * @returns {React$Node}
     */
    _renderItemLine(line: string, index: number): JSX.Element | null;
    /**
     * Renders the additional item lines, if any.
     *
     * @param {Array<string>} lines - The lines to render.
     * @private
     * @returns {Array<React$Node>}
     */
    _renderItemLines(lines?: string[]): (JSX.Element | null)[] | null;
    /**
     * Renders the secondary action label.
     *
     * @private
     * @returns {React$Node}
     */
    _renderSecondaryAction(): JSX.Element;
    /**
     * Renders the content of this component.
     *
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
