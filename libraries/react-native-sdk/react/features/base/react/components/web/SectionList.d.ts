import { Component } from 'react';
import { Section } from '../../types';
export interface IProps {
    /**
     * Rendered when the list is empty. Should be a rendered element.
     */
    ListEmptyComponent: Object;
    /**
     * Used to extract a unique key for a given item at the specified index.
     * Key is used for caching and as the react key to track item re-ordering.
     */
    keyExtractor: Function;
    /**
     * Defines what happens when  an item in the section list is clicked.
     */
    onItemClick: Function;
    /**
     * Returns a React component that renders each Item in the list.
     */
    renderItem: Function;
    /**
     * Returns a React component that renders the header for every section.
     */
    renderSectionHeader: Function;
    /**
     * An array of sections.
     */
    sections: Array<Section>;
}
/**
 * Implements a React/Web {@link Component} for displaying a list with
 * sections similar to React Native's {@code SectionList} in order to
 * facilitate cross-platform source code.
 *
 * @augments Component
 */
export default class SectionList extends Component<IProps> {
    /**
     * Renders the content of this component.
     *
     * @returns {React.ReactNode}
     */
    render(): JSX.Element | null;
}
