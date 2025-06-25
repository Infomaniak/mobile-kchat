import { Component } from 'react';
import { Item } from '../../types';
/**
 * The type of the React {@code Component} props of
 * {@link NavigateSectionListItem}.
 */
export interface IProps {
    /**
     * A item containing data to be rendered.
     */
    item: Item;
    /**
     * Function to be invoked when an item is pressed. The item's URL is passed.
     */
    onPress?: Function;
}
/**
 * Implements a React/Web {@link Component} for displaying an item in a
 * NavigateSectionList.
 *
 * @augments Component
 */
export default class NavigateSectionListItem<P extends IProps> extends Component<P> {
    /**
     * Renders the content of this component.
     *
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
