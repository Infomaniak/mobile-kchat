import React, { Component } from 'react';
import { SectionListRenderItemInfo } from 'react-native';
import { Item, Section } from '../../types';
/**
 * The type of the React {@code Component} props of {@link SectionList}.
 */
export interface IProps {
    /**
     * Rendered when the list is empty. Can be a React Component Class, a render
     * function, or a rendered element.
     */
    ListEmptyComponent: React.ReactElement<any>;
    /**
    *
    * Used to extract a unique key for a given item at the specified index.
     * Key is used for caching and as the react key to track item re-ordering.
    */
    keyExtractor: (item: Item, index: number) => string;
    /**
    *
    * Functions that defines what happens when the list is pulled for refresh.
    */
    onRefresh: () => void;
    /**
    *
    * A boolean that is set true while waiting for new data from a refresh.
    */
    refreshing?: boolean;
    /**
    *
    * Default renderer for every item in every section.
    */
    renderItem: (info: SectionListRenderItemInfo<Item, Section>) => React.ReactElement<any>;
    /**
    *
    * A component rendered at the top of each section. These stick to the top
     * of the ScrollView by default on iOS.
    */
    renderSectionHeader: any;
    /**
     * An array of sections.
     */
    sections: Array<Section>;
}
/**
 * Implements a React Native {@link Component} that wraps the React Native
 * SectionList component in a SafeAreaView so that it renders the sectionlist
 * within the safe area of the device.
 *
 * @augments Component
 */
export default class SectionList extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
