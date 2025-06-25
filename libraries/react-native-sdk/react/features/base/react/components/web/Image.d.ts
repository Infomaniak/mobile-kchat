import React, { Component } from 'react';
/**
 * Implements a React/Web {@link Component} for displaying image
 * in order to facilitate cross-platform source code.
 *
 * @augments Component
 */
export default class Image extends Component<React.HTMLProps<HTMLImageElement>> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): React.DetailedReactHTMLElement<Readonly<React.HTMLProps<HTMLImageElement>> & Readonly<{
        children?: React.ReactNode;
    }>, HTMLImageElement>;
}
