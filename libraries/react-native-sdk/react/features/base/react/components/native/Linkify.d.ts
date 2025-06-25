import React, { Component } from 'react';
import { StyleType } from '../../../styles/functions.any';
export interface IProps {
    /**
     * The children of the component.
     */
    children: React.ReactNode;
    /**
     * The extra styles to be applied to links.
     */
    linkStyle: StyleType;
    /**
     * The extra styles to be applied to text.
     */
    style?: StyleType;
}
/**
 * Implements a react native wrapper for the react-linkify component.
 */
export default class Linkify extends Component<IProps> {
    /**
     * Initiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements {@code Component#render}.
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
