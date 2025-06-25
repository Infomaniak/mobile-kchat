import { Component } from 'react';
import { SectionListSection } from '../../types';
export interface IProps {
    /**
     * A section containing the data to be rendered.
     */
    section: SectionListSection;
}
/**
 * Implements a React/Native {@link Component} that renders the section header
 * of the list.
 *
 * @augments Component
 */
export default class NavigateSectionListSectionHeader extends Component<IProps> {
    /**
     * Renders the content of this component.
     *
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
