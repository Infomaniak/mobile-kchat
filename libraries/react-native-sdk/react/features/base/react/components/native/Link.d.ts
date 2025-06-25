import React, { Component } from 'react';
/**
 * The type of the React {@code Component} props of {@link Link}.
 */
export interface IProps {
    /**
     * The children to be displayed within this Link.
     */
    children: React.ReactNode;
    /**
     * Notifies that this Link failed to open the URL associated with it.
     */
    onLinkingOpenURLRejected?: Function;
    /**
     * The CSS style to be applied to this Link for the purposes of display.
     */
    style?: Object;
    /**
     * The URL to be opened when this Link is clicked/pressed.
     */
    url: string;
}
/**
 * Implements a (hyper)link to a URL in the fashion of the HTML anchor element
 * and its href attribute.
 */
export default class Link extends Component<IProps> {
    /**
     * Initializes a new Link instance.
     *
     * @param {Object} props - Component properties.
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Notifies this instance that Linking failed to open the associated URL.
     *
     * @param {any} reason - The rejection reason.
     * @private
     * @returns {void}
     */
    _onLinkingOpenURLRejected(reason: Error): void;
    /**
     * Handles press on this Link. Opens the URL associated with this Link.
     *
     * @private
     * @returns {void}
     */
    _onPress(): void;
}
