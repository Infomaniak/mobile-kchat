import React, { Component } from 'react';
import { Item, Section, SectionListSection } from '../../types';
export interface IProps {
    /**
     * Indicates if the list is disabled or not.
     */
    disabled: boolean;
    /**
     * Function to be invoked when an item is long pressed. The item is passed.
     */
    onLongPress?: Function;
    /**
     * Function to be invoked when an item is pressed. The item's URL is passed.
     */
    onPress: (e: string, a?: string) => void;
    /**
     * Function to be invoked when pull-to-refresh is performed.
     */
    onRefresh: Function;
    /**
     * Function to be invoked when a secondary action is performed on an item.
     * The item's ID is passed.
     */
    onSecondaryAction: Function;
    /**
     * Function to override the rendered default empty list component.
     */
    renderListEmptyComponent: React.ReactElement<any>;
    /**
     * An array of sections.
     */
    sections: Array<Section>;
}
/**
 * Implements a general section list to display items that have a URL property
 * and navigates to (probably) meetings, such as the recent list or the meeting
 * list components.
 */
declare class NavigateSectionList extends Component<IProps> {
    /**
     * Creates an empty section object.
     *
     * @param {string} title - The title of the section.
     * @param {string} key - The key of the section. It must be unique.
     * @private
     * @returns {Object}
     */
    static createSection(title: string, key: string | number): {
        data: any[];
        key: string | number;
        title: string;
    };
    /**
     * Constructor of the NavigateSectionList component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's {@code Component.render}.
     * Note: We don't use the refreshing value yet, because refreshing of these
     * lists is super quick, no need to complicate the code - yet.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Generates a unique id to every item.
     *
     * @param {Object} item - The item.
     * @param {number} index - The item index.
     * @private
     * @returns {string}
     */
    _getItemKey(item: Item, index: number): string;
    /**
     * Returns a function that is used in the onLongPress callback of the items.
     *
     * @param {Object} item - The item that was long-pressed.
     * @private
     * @returns {Function}
     */
    _onLongPress(item: Item): (() => any) | undefined;
    /**
     * Returns a function that is used in the onPress callback of the items.
     *
     * @param {string} url - The URL of the item to navigate to.
     * @private
     * @returns {Function}
     */
    _onPress(url: string): (() => void) | undefined;
    /**
     * Invokes the onRefresh callback if present.
     *
     * @private
     * @returns {void}
     */
    _onRefresh(): void;
    /**
     * Returns a function that is used in the secondaryAction callback of the
     * items.
     *
     * @param {string} id - The id of the item that secondary action was
     * performed on.
     * @private
     * @returns {Function}
     */
    _onSecondaryAction(id: string): () => void;
    /**
     * Renders a single item in the list.
     *
     * @param {Object} listItem - The item to render.
     * @param {string} key - The item needed for rendering using map on web.
     * @private
     * @returns {Component}
     */
    _renderItem(listItem: {
        item: Item;
    }, key?: string): JSX.Element;
    /**
     * Renders a component to display when the list is empty.
     *
     * @param {Object} section - The section being rendered.
     * @private
     * @returns {React$Node}
     */
    _renderListEmptyComponent(): React.ReactElement<any>;
    /**
     * Renders a section header.
     *
     * @param {Object} section - The section being rendered.
     * @private
     * @returns {React$Node}
     */
    _renderSectionHeader(section: SectionListSection): JSX.Element;
}
export default NavigateSectionList;
