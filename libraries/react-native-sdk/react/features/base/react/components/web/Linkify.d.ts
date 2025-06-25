import { Component, ReactNode } from 'react';
export interface IProps {
    /**
     * The children of the component.
     */
    children: ReactNode;
}
/**
 * Implements a react wrapper for the react-linkify component.
 */
export default class Linkify extends Component<IProps> {
    /**
     * Implements {@Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Implements a component decorator for react-linkify.
     *
     * @param {string} decoratedHref - The href src.
     * @param {string} decoratedText - The link text.
     * @param {string} key - The component key.
     * @returns {React$Node}
     */
    _componentDecorator(decoratedHref: string, decoratedText: string, key: number): JSX.Element;
}
